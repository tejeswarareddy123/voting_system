const db = require("../../Entity")
const Admin=db.ADMIN_TRAINING

///create training 
const create_training = async (req, res) => {

    try {
        console.log("I'm here")
        if (req.body) {
           
            await Admin.create({
                training_name: req.body.training_name,
                trainer:req.body.trainer,
                skill_title:req.body.skill,
                description:req.body.description,
                domain:req.body.domain,
                startdate:req.body.startDate.toLocaleString(),
                enddate:req.body.endDate,
                no_of_seats:req.body.seats,
                initial_seats:req.body.seats,
                
            });

            res.send({message:'response success' })
           
        }
        else {
            res.send("Response failed to add to DB")
        }
    } catch (error) {
        console.log("error")
        res.send({ statusCode: 400, message: 'db error' })

    }
}

//Training soft deletion
const delete_training=async (req,res)=>{
    
    try{
        if(req.body.training_id)
        {
            
            const del= await Admin.findOne({
                where:{
                    id:req.body.training_id
                }
            }).then((data)=>{
                if(data.isdelete!==true){
                data.isdelete=true
                data.save()
                res.send({statusCode:200,message:"Training deleted successfully"})
            }   else{
                res.send({statusCode:400,message:"Training already deleted"})
            }
            })
            
        }
        else{
            res.send({statusCode:400,message:"Failed to fetch"})
        }
    }
    catch(error)
    {
        res.send({statusCode:400,message:"Training Id is invalid"})
    }

}


///archive trainings
const view_trainings= async(req,res)=>{
    try {
        const view= await Admin.findAll({
            where:{
                isdelete:false
            }
        }).then((data)=>{
            if(data){
                res.send({message:"View success",data})        
            }
            else{
                res.send({message:'Failed to view'})
            }
        })
    } catch (error) {
        res.send({message:"Failed to retrieve from DB"})
        
    }

}

//restore trainings
const restore_trainings=async(req,res)=>{
    const training_id=req.body.id
    try{
        if(training_id)
        {
            
            const restore= await Admin.findOne({
                where:{
                    id:training_id
                }
            }).then((data)=>{
                if(data.isdelete===true){
                data.isdelete=false
                data.save()
                res.send({statusCode:200,message:"Training restored successfully"})
            }   else{
                res.send({statusCode:400,message:"Training already active"})
            }
            })
            
        }
        else{
            res.send({statusCode:400,message:"Failed to fetch"})
        }
    }
    catch(error)
    {
        res.send({statusCode:400,message:"Training Id is invalid"})
    }

}

///showing deleted trainings
const deleted_trainings= async(req,res)=>{
    try {
        const view= await Admin.findAll({
            where:{
                isdelete:true
            }
        }).then((data)=>{
            if(data){
                res.send({message:"View deleted training success",data})        
            }
            else{
                res.send({message:'Failed to view'})
            }
        })
    } catch (error) {
        res.send({message:"Failed to retrieve from DB"})
        
    }

}
module.exports = {

    create_training,
    delete_training,
    view_trainings,
    restore_trainings,
    deleted_trainings
};