
//register api
const registerUser = async (req, res) =>{
res.status(200).json({
    message: "Register succesfully !"
})
}


//login api
const loginUser = async (req, res) =>{
res.status(200).json({
    message: "Login succesfully !"
})
}

module.exports = { registerUser, loginUser };