import { Location } from "../models/location.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";





const addlocation = asyncHandler(async(req,res) => {
    const { name,country,city } = req.body;
    if (!name || !country || !city) {
        return res.status(400).json({ message: "Name, country and city are required" });
    }

    const newLocation = new Location({ name, country, city });
   
    
    await newLocation.save();

    return res.status(201).json({ message: "Location added successfully", data: newLocation });
});

export {
    addlocation
}