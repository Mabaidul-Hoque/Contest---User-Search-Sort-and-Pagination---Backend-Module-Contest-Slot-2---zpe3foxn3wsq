//Before implementing queryController.js plz refer to userModel first

const User = require('../models/userModel');

const filterQueries = async (req, res) => {
  try {
    //Write your code here for sorting,pagination and searching
    //1) For sorting sort salary from ascending to descending order
    //2) For Pagination set limit 5 as a default limit and default page is 1
    //3) Implement serching on 'first_name' and 'last_name'
    // Formulae to implementing pagination: (page - 1) * limit
    // For Sorting use    .sort('salary')

    const sortField = req.query.sortBy || 'salary';
    const sortOrder = req.query.sortOrder === 'disc' ? -1 : 1;
    const sortQuery = { [ sortField ] : sortOrder};

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page-1) * limit;

    const searchQuery = {};
    if(req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      searchQuery.$or = [
        {first_name: searchRegex},
        {last_name: searchRegex},
      ];
    }

    const users = await User.find(searchQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    res.json(users);  

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { filterQueries };
