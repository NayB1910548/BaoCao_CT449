const { ObjectId } = require("mongodb");

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection("contacts");
    }


    extractConactData(payload) {
        const contact = {
            name: payload.name,
            MSSV: payload.MSSV,
            bday: payload.bday,
            sex: payload.sex,
            nclass: payload.nclass,
            sub: payload.sub,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
        };

        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );
        return contact;
    }

    async create(payload) {
        const contact = this.extractConactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            contact,
            { $set: { acc: contact.acc === contact.acc}},
            { returnDocument: "after", upsert: true }

        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
        }
        async findByName(name) {
        return await this.find({
        name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Contact.findOne({
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
 
    async update(id, payload) {
        const filter = {
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.Contact.findOneAndUpdate(
        filter,
        { $set: update });
        return result.value;
        }
    
    async delete(id) {
        const result = await this.Contact.findOneAndDelete({
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
   
    async findFavorite() {
        return await this.find({ favorite: true });
        }
   
    async deleteAll() {
        const result = await this.Contact.deleteMany({});
        return result.deletedCount;
        }  
    

}

module.exports = ContactService;