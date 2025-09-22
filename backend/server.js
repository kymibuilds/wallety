import express from "express";
const PORT = 5001;
const app = express();

app.get("/",(req,res)=>{
    res.send("its working on the port");
})

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});

