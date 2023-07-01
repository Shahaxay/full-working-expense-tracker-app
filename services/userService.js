const getExpenseReportLinks=(req,where)=>{
    return req.user.getExpenseReportLinks({where});
}

module.exports={
    getExpenseReportLinks
}