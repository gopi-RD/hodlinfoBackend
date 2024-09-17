const express = require('express')
const app = express()
const path = require('path') 
const cors=require("cors")
const PORT=3000;
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

app.use(express.json())
app.use(cors())


const dbpath = path.join(__dirname, 'cryptocurrency.db')

let db = null

const initalizeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(PORT, () => {
      console.log('Server is running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error ${e.message}`)
    process.exit(1)
  }
}


initalizeDBAndServer()
app.get("/",async (request,response)=>{
    response.send({message:"Welcome to HODLINFO_CLONE Assignment"})
})

app.get("/api/getTop10",async (request,response)=>{
  const {limit=10,offset=0} = request.query
  const getSource=`SELECT * FROM crypto LIMIT ${limit} OFFSET ${offset};`;
  const dbResponse= await db.all(getSource)
  response.send(dbResponse)
  response.status(200)
})

app.post("/api/add-data",async (request,response)=>{
  const {name, last, buy, sell, volume, base_unit,open,low,high,at,type}=request.body;
  const addData= `INSERT INTO crypto (name, last, buy, sell, volume,base_unit,open,low,high,at,type) VALUES (
      "${name}",
      "${last}",
      "${buy}",
      "${sell}",
      "${volume}",
      "${base_unit}",
      "${open}",
      "${low}",
      "${high}",
      "${at}",
      "${type}"
  ) ;`;
  await db.run(addData);
  response.send({message:"Data Added successfully"}) 
})


app.delete("/api/delete-all",async (request, response) => {
  const deleteAllData = `DELETE FROM crypto;`;
  await db.run(deleteAllData);
  response.send({message:"All data deleted successfully"})
})



