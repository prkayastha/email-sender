const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../models');

/**
 * function to list all the users
 * @param {number} offset offset of the row
 * @param {number} limit limit of the rows to be returned
 * @param {<Array>[]} orders list of arrays to be order by. eg [['username', 'asc'], ['email', 'asc']]
 * @param {string} searchString search value
 */
const list = function (offset, limit, orders, searchString) {
    const whereCondition = {
        deleted: false
    };
    const offsetRows = offset || 0;
    const limitRows = limit || 10;
    
    searchString = searchString.trim()+'%';
    if (searchString != null && searchString.trim() !== '') {
        whereCondition[Op.or] = [
            {
                username: { [Op.like]: searchString }
            },
            {
                email: { [Op.like]: searchString }
            }
        ];
    }

    const column = ['id', 'username', 'email', 'lastSignIn', 'createdAt'];

    const listQuery = {
        attributes: ['id', 'username', 'email', 'lastSignIn', 'createdAt', 'version'],
        include: [
            { model: models.Roles }
        ],
        offset: +offsetRows,
        limit: +limitRows,
        where: whereCondition
    };

    if (orders != null && orders.length > 0) {
        for(let i=0; i<orders.length; i++) {
            orders[i][0] = column[orders[i][0]];
        }
        listQuery.order = orders;
    }

    return models.Users.findAll(listQuery).then(users => {
        return Promise.resolve(users);
    });
};

module.exports = list;
