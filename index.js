const express = require('express')
const cors = require('cors')
const Employee = require('./config')
const app = express()
const PORT = 4000

app.use(express.json())
app.use(cors())

app.listen(PORT, () => {
   console.log(`API Listening on PORT ${PORT}`)
})

app.get('/api/employee', async (req, res) => {
   const snapshot = await Employee.get()
   const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
   res.send(list)
})

app.post('/api/employee/create', async (req, res) => {
   try {
      const data = req.body
      await Employee.add({
         keyId: data.keyId,
         position_id: data.position_id,
         position: data.position_id,
         nickname_th: data.nickname_th,
         nickname_en: data.nickname_en,
         fullname_th: data.fullname_th,
         fullname_en: data.fullname_en,
         phone: data.phone,
         email: data.email,
         picture: data.picture,
         skill: data.skill,
         date_start: data.date_start,
         university: data.university,
         branch: data.branch
      })

      return res.status(200).json({
         RespCode: 200,
         RespMessage: 'Added'
      })
   } catch (error) {
      return res.status(500).json({
         RespCode: 500,
         RespMessage: error.message
      })
   }
})

module.exports = app
