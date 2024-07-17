const Customer = require("../models/customer");

const approveCustomerService = async (customer_id) => {
  try {
    const is_approved = await Customer.update(
      { is_approved: true },
      {
        where: {
          customer_id,
        },
      }
    );

    if (is_approved > 0) {
      return {
        is_approved:true,
        message: "customer has been approved"
      };
    } else {
        return {
            is_approved:true,
            message: "customer not been approved"
          };
    }
  } catch (error) {
    console.log('error at root project -> services -> adminService.js');
    console.log(error);
  }
};

module.exports={
    approveCustomerService
}
