import express from 'express';
import paginate from 'express-paginate'
import HttpError from 'http-errors';
import httpStatus from 'http-status';
import orderRepo from '../repositories/order.repo.js';
import pizzeriaRepo from '../repositories/pizzeria.repo.js'

const router = express.Router()

class PizzeriasRoutes {
    constructor() {
        router.get('/', paginate.middleware(25, 50), this.getAll)
        router.get('/:pizzeriaID', this.getOne)
        router.get('/:pizzeriaID/orders/:orderID', this.getOneOrder)
    }


    async getOneOrder(req, res, next) {
        const pizzID = req.params.pizzeriaID
        const orderId = req.params.orderID
        const retrieveOptions = {};
        const transformOptions = { embed: {} }
        if(req.query.embed && req.query.embed === 'customer') {
            retrieveOptions.customer = true;
            transformOptions.embed.customer = true;
        }

        console.log(`Get One - Order ID: ${orderId}- Pizzeria ID : ${pizzID}`);

        try {
            let response = await pizzeriaRepo.retrievePizzIdWithOrderId(pizzID, orderId, retrieveOptions)
            console.log(response);       
            if (response.length > 0) {                
                response = response.map(e => {
                    e = e.toObject({ getters: false, virtuals: false });
                    e = orderRepo.transform(e, transformOptions);
                    return e;
                });
            } else {
                return next(HttpError.NotFound("la commande n'appartient pas a cette pizzeria"))
            }

            res.status(httpStatus.OK).json(response)


        } catch (err) {
            return next(err)
        }
    }

    async getAll(req, res, next) {

        const retrieveOptions = {
            skip: req.skip,
            limit: req.query.limit,
            speciality: req.query.speciality
        };

        const transformOptions = { };

        try {

            if (retrieveOptions.speciality != undefined) {
                let [pizzerias, documentsCount] = await pizzeriaRepo.retrieveAllBySpeciality(retrieveOptions);

                pizzerias = pizzerias.map(e => {
                    e = e.toObject({ getters: false, virtuals: true });
                    e = pizzeriaRepo.transform(e, transformOptions);
                    return e;
                });
                const pageCount = Math.ceil(documentsCount / req.query.limit);
                const hasNextPage = (paginate.hasNextPages(req))(pageCount);
                const pageArray = paginate.getArrayPages(req)(3, pageCount, req.query.page);

                const response = {
                    _metadata: {
                        hasNextPage: hasNextPage,
                        page: req.query.page,
                        limit: req.query.limit,
                        skip: req.skip,
                        totalPages: pageCount,
                        totalDocuments: documentsCount
                    },
                    _links: {
                        first: `/pizzerias?page=1&limit=${req.query.limit}&speciality=${req.query.speciality}`,
                        prev: pageArray[0].url, //`${process.env.BASE_URL}${pageArray[0].url}`  
                        self: pageArray[1].url,
                        // next:pageArray[2].url,
                        last: `/pizzerias?page=${pageCount}&limit=${req.query.limit}&speciality=${req.query.speciality}`
                    },
                    data: pizzerias
                };
                if (req.query.page === 1) {
                    delete response._links.prev;
                    response._links.self = pageArray[0].url;
                    response._links.next = pageArray[1].url;
                }

                if (!hasNextPage) {
                    response._links.prev = pageArray[0].url;
                    response._links.self = pageArray[1].url;
                    delete response._links.next;
                }

                res.status(200).json(response);
            }
            else {
                let [pizzerias, documentsCount] = await pizzeriaRepo.retrieveAll(retrieveOptions);

                pizzerias = pizzerias.map(e => {
                    e = e.toObject({ getters: false, virtuals: false });
                    e = pizzeriaRepo.transform(e, transformOptions);
                    return e;
                });
                const pageCount = Math.ceil(documentsCount / req.query.limit);
                const hasNextPage = (paginate.hasNextPages(req))(pageCount);
                const pageArray = paginate.getArrayPages(req)(3, pageCount, req.query.page);

                const response = {
                    _metadata: {
                        hasNextPage: hasNextPage,
                        page: req.query.page,
                        limit: req.query.limit,
                        skip: req.skip,
                        totalPages: pageCount,
                        totalDocuments: documentsCount
                    },
                    _links: {
                        first: `/pizzerias?page=1&limit=${req.query.limit}`,
                        prev: pageArray[0].url, //`${process.env.BASE_URL}${pageArray[0].url}`  
                        self: pageArray[1].url,
                        next: pageArray[2].url,
                        last: `/pizzerias?page=${pageCount}&limit=${req.query.limit}`
                    },
                    data: pizzerias
                };
                if (req.query.page === 1) {
                    delete response._links.prev;
                    response._links.self = pageArray[0].url;
                    response._links.next = pageArray[1].url;
                }

                if (!hasNextPage) {
                    response._links.prev = pageArray[0].url;
                    response._links.self = pageArray[1].url;
                    delete response._links.next;
                }

                res.status(200).json(response);
            }



        } catch (err) {
            return next(err);
        }

    }

    async getOne(req, res, next) {
        const pizzID = req.params.pizzeriaID
        const wantsOrders = req.query.embed && req.query.embed == "orders"
        let transformOptions = { embed: { } }
        if (wantsOrders) {
            transformOptions.embed.orders = true;
        }
        console.log(`Get One - Pizzeria - ID : ${pizzID}`);

        try {
            let reponse = await pizzeriaRepo.retrieveByID(pizzID, wantsOrders)

            if (!reponse) {
                return next(HttpError.NotFound("Ca existe pas c'te pizzeria là!"))
            }
            // Quand on pense qu'il va avoir un embed , c'est virtuals a true..?
            reponse = reponse.toObject({ getters: false, virtuals: true })
            reponse = pizzeriaRepo.transform(reponse, transformOptions)

            res.status(httpStatus.OK).json(reponse)
        } catch (err) {
            return next(err)
        }
    }
}


new PizzeriasRoutes()

export default router