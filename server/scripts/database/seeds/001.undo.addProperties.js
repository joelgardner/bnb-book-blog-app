db.getCollection('Property').deleteMany({ id: { $lt: 0 } })
