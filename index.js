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

app.get('/api/employee/by/:id', async (req, res) => {
   try {
      const employeeRef = Employee.doc(req.params.id)
      const response = await employeeRef.get()

      return res.status(200).json({
         RespCode: 200,
         RespMessage: 'good',
         Result: response.data()
      })
   } catch (error) {
      console.error(error)
      return res.status(500).json({
         RespCode: 500,
         RespMessage: 'An unexpected error occurred'
      })
   }
})

app.post('/api/employee/create', async (req, res) => {
   try {
      // Check that the request body is present and contains the expected data
      if (
         !req.body ||
         !req.body.position_id ||
         !req.body.nametitle_th ||
         !req.body.nametitle_en ||
         !req.body.firstname_en ||
         !req.body.firstname_th ||
         !req.body.lastname_en ||
         !req.body.lastname_th
      ) {
         return res.status(400).json({
            RespCode: 400,
            RespMessage: 'Bad request'
         })
      }

      // Provide default values for optional properties
      const input = {
         picture: req.body.picture || null,
         gender: req.body.gender || null,
         position_id: req.body.position_id,
         nametitle_th: req.body.nametitle_th,
         nametitle_en: req.body.nametitle_en,
         firstname_en: req.body.firstname_en,
         firstname_th: req.body.firstname_th,
         lastname_en: req.body.lastname_en,
         lastname_th: req.body.lastname_th,
         nickname_th: req.body.nickname_th || null,
         nickname_en: req.body.nickname_en || null,
         skill: req.body.skill || [],
         university: req.body.university || null,
         group: req.body.group || null,
         branch: req.body.branch || null,
         line: req.body.line || null,
         phone: req.body.phone || null,
         email: req.body.email || null,
         email_reserve: req.body.email_reserve || null,
         facebook: req.body.facebook || null,
         date_birthday: req.body.date_birthday || null,
         date_start: req.body.date_start || null,
         status_active: true,
         date_create: new Date().toISOString()
      }

      // Add the employee record
      const result = await Employee.add(input)
      if (!result) {
         return res.status(500).json({
            RespCode: 500,
            RespMessage: 'Error adding employee'
         })
      }

      // Return success response
      return res.status(200).json({
         RespCode: 200,
         RespMessage: 'Added'
      })
   } catch (error) {
      // Handle rejected promises
      return res.status(500).json({
         RespCode: 500,
         RespMessage: error.message
      })
   }
})

// app.post('/api/employee/update', async (req, res) => {
//    try {
//       const id = req.body.id
//       delete req.body.id
//       const data = req.body
//       await Employee.doc(id).update({
//          position_id: data.position_id,
//          position: data.position_id,
//          nickname_th: data.nickname_th,
//          nickname_en: data.nickname_en,
//          fullname_th: data.fullname_th,
//          fullname_en: data.fullname_en,
//          phone: data.phone,
//          email: data.email,
//          picture: data.picture,
//          skill: data.skill,
//          date_start: data.date_start,
//          university: data.university,
//          branch: data.branch,
//          line: data.line
//       })
//       return res.status(200).json({
//          RespCode: 200,
//          RespMessage: 'Updated'
//       })
//    } catch (error) {
//       return res.status(500).json({
//          RespCode: 500,
//          RespMessage: error.message
//       })
//    }
// })

module.exports = app
