import Order from '../models/order.model.js';
import customerRepo from './customer.repo.js';
// import objectToDotNotation from '../libs/objectToDotNotation.js';
// import dayjs from 'dayjs';

class OrderRepository {

    transform(order, transformOptions = { }) {

        order.pizzeria = { href: `/pizzerias/${order.pizzeria}` }
        
        if(transformOptions.embed && transformOptions.embed.customer) {
            order.customer = customerRepo.transform(order.customer, transformOptions);
        } else{
            order.customer = { href: `/customers/${order.customer}` }
        }

        order.pizzas = order.pizzas.map(pizza => {
            delete pizza.id
            delete pizza._id
            
            return pizza
        })

        
        
        order.href = `/orders/${order._id}`
        
        delete order.id
        delete order._id

        // Calcul du prix de la pizza.
        let total = 0;
        
        order.pizzas.forEach(piz => {
            total += parseFloat(piz.price)
        })
        order.subTotal = parseFloat(total.toFixed(3))
        order.taxRate = process.env.TAX_RATE
        order.taxes = parseFloat((order.subTotal * order.taxRate).toFixed(3))
        order.total = (order.subTotal + order.taxes).toFixed(3)

        return order
    }
}

export default new OrderRepository()