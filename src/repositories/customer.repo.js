import objectToDotNotation from '../libs/objectToDotNotation.js';
import Customer from '../models/customer.model.js';
import daysjs from 'dayjs'

class CustomerRepository {

    retrieveByID(customerID, wantsOrders) {
        const reponse = Customer.findById(customerID)

        // tente pas.
        // if(wantsOrders)
        //     reponse.populate('orders')

        return reponse
    }

    retrieveAll(retrieveOptions) {
        let queryAll

        if (retrieveOptions.planet != undefined)
            queryAll = Customer.find({ planet: retrieveOptions.planet }).skip(retrieveOptions.skip).limit(retrieveOptions.limit).sort('-birthday')
        else
            queryAll = Customer.find().skip(retrieveOptions.skip).limit(retrieveOptions.limit).sort('-birthday')

        const estimatedResQuery = Customer.estimatedDocumentCount();

        return Promise.all([queryAll, estimatedResQuery])
    }

    async retrieveAllEmails() {
        return await Customer.find({ }).select('email -_id')
    }

    // Je vais peux etre la changer et l'utiliser dans la validation d'un customer.
    async isUnique(email) {
        let emailList = await this.retrieveAllEmails()
        emailList = emailList.map(objEmail => {
            return objEmail.email
        })

        return !emailList.includes(email)
    }

    create(customer) {
        return Customer.create(customer);
    }

    fullUpdate(customerID, customerInfos) {
        customerInfos = objectToDotNotation(customerInfos)
        const reponse = Customer.findByIdAndUpdate(customerID, customerInfos, { new: true })

        return reponse
    }

    transform(customer) {

        customer.phone = `[${customer.phone.slice(0,4)}]${customer.phone.slice(4,8)}-${customer.phone.slice(8,14)}@${customer.phone.slice(14,16)}`
        customer.href = `/customers/${customer._id}`
        customer.age = new daysjs().diff(customer.birthday,"years")
        customer.lightspeed = `[${customer.planet}]@${customer.coord.lat};${customer.coord.lon}`

        delete customer.id;
        delete customer._id;
        delete customer.__v;

        return customer;
    }
}

export default new CustomerRepository()