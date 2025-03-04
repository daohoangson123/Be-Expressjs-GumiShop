import UserSchema from '../models/userSchema.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import config from '../../config.js';
import HttpStatusCode from '../constants/httpStatusCode.js';
import {
    BadRequest,
    PaginationResponse,
    SuccessResponse,
} from '../apiResponses/apiResponse.js';
import mongoose from 'mongoose';
import blackList from '../../blackList.js';

class AuthController {
    async signup(req, res, next) {
        try {
            const { email, password } = req.body;
            // 1. Validate email
            if (!validator.isEmail(email)) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(new BadRequest('Email format is invalid!'));
            }

            // 2. Find User by email has existed in database or not
            const getUser = await UserSchema.findOne({
                email,
            });

            if (getUser) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(
                        new BadRequest(
                            'Email already used, please try other email',
                        ),
                    );
            }

            // 3. Create model to insert database
            const user = new UserSchema({
                email,
                password,
            });

            // 4. Save to database and return result
            await user.save();
            return res
                .status(HttpStatusCode.Success)
                .send(new SuccessResponse(user));
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        const { email, password } = req.body;

        // 1. Find and compare user email/password in database
        const getUser = await UserSchema.login(email, password);

        if (!getUser) {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(new BadRequest('Email or password is invalid'));
        }

        const payload = {
            email: getUser.email,
            id: getUser._id,
            role: getUser.role,
        };
        const token = jwt.sign(payload, config.jwt.secretKey, {
            expiresIn: Number.parseInt(config.jwt.expiresIn),
        });

        res.send(
            new SuccessResponse({
                access_token: token,
                role: payload.role,
            }),
        );
    }

    async logout(req, res, next) {
        return res.status(HttpStatusCode.Success).send(
            new SuccessResponse({
                blackList: blackList,
            }),
        );
    }

    async getUserById(req, res, next) {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(new BadRequest(`Can not find user with id: ${id}`));
        } // validating id

        const user = await UserSchema.findOne({
            _id: id,
        });

        const getId = res.locals.id;

        if (getId === id) {
            return res
                .status(HttpStatusCode.Success)
                .send(new SuccessResponse(user));
        } else {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(new BadRequest('Can not get user information'));
        }
    }

    async getUsers(req, res, next) {
        const { pageIndex, pageSize, sort } = req.body;

        const page = Number.parseInt(pageIndex || 1);
        const limit = Number.parseInt(pageSize || 10);

        const query = UserSchema.find()
            .skip((page - 1) * limit)
            .limit(limit);

        if (sort) {
            query.sort({
                [sort.field]: sort.value === 'asc' ? 1 : -1,
            });
        }

        const users = await query; // at this time it will call to db and get data to client
        const total = await UserSchema.countDocuments();

        const convertData = users.map((user) => ({
            id: user._id,
            email: user.email,
            role: user.role,
            info: user.info,
            isDelete: user.isDelete,
            deletedDate: user.deletedDate,
        }));
        return res
            .status(HttpStatusCode.Success)
            .send(new PaginationResponse(convertData, page, limit, total));
    }

    async updateUser(req, res, next) {
        try {
            const { id } = req.params;

            const { email, password } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(new BadRequest(`Can not find user with id: ${id}`));
            } // validating id

            const user = await UserSchema.findOne({
                _id: id,
            });

            if (!user) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(new BadRequest('User does not exist in Database'));
            }

            if (user.role === 'admin') {
                const updateResult = await UserSchema.updateOne(
                    {
                        _id: id,
                    },
                    {
                        $set: { password: password, role: role, info: info },
                    },
                );
            } else {
                const updateResult = await UserSchema.updateOne(
                    {
                        _id: id,
                    },
                    {
                        $set: { password: password, info: info },
                    },
                );
            }

            if (updateResult.modifiedCount === 0 || user.isDelete === true) {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .send(new BadRequest(`Can not update user with id: ${id}`));
            }

            return res
                .status(HttpStatusCode.Success)
                .send(
                    new SuccessResponse('User has been updated successfully'),
                );
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        const { id } = req.params;

        const user = await UserSchema.findOne({
            _id: id,
        });

        if (!user) {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(new BadRequest('User does not exist in Database'));
        }

        const updateResult = await UserSchema.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    isDelete: true,
                    deletedDate: new Date(),
                },
            },
        );

        if (updateResult.modifiedCount === 0) {
            return res
                .status(HttpStatusCode.BadRequest)
                .send(new BadRequest(`Can not delete user with id: ${id}`));
        }

        return res.status(HttpStatusCode.Success).send(new SuccessResponse());
    }
}

export default new AuthController();
