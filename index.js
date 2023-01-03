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

// ===================== \MODULE EMPLOYEE/ =====================
app.get('/api/employee', async (req, res) => {
   const snapshot = await Employee.get()
   const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
   res.send(list)
})

app.get('/api/employee/code', async (req, res) => {
   const snapshot = await Employee.get()
   const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      picture: doc.data().picture,
      gender: doc.data().gender,
      position_id: doc.data().position_id,
      nametitle_th: doc.data().nametitle_th,
      nametitle_en: doc.data().nametitle_en,
      firstname_en: doc.data().firstname_en,
      firstname_th: doc.data().firstname_th,
      lastname_en: doc.data().lastname_en,
      lastname_th: doc.data().lastname_th,
      nickname_th: doc.data().nickname_th,
      nickname_en: doc.data().nickname_en,
      skill: doc.data().skill,
      university: doc.data().university,
      group: doc.data().group,
      branch: doc.data().branch,
      line: doc.data().line,
      phone: doc.data().phone,
      email: doc.data().email,
      email_reserve: doc.data().email_reserve,
      date_birthday: doc.data().date_birthday,
      date_start: doc.data().date_start,
      status_active: doc.data().status_active,
      code_id: doc.data().code_id,
      level_skill: doc.data().level_skill,
      lastpassword: doc.data().lastpassword
   }))

   const resultList = list.filter((x) => x.status_active)
   res.send(resultList)
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
      if (!req.body || !req.body.position_id || !req.body.firstname_en || !req.body.firstname_th || !req.body.lastname_en || !req.body.lastname_th) {
         return res.status(400).json({
            RespCode: 400,
            RespMessage: 'Bad request'
         })
      }

      // Provide default values for optional properties
      const request = {
         picture: req.body.picture || null,
         gender: req.body.gender || null,
         position_id: req.body.position_id,
         nametitle_th: req.body.nametitle_th || null,
         nametitle_en: req.body.nametitle_en || null,
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
         code_id: req.body.code_id || null,
         level_skill: req.body.level_skill || '',
         address: req.body.address || null,
         lastpassword: req.body.lastpassword || null,
         date_create: new Date().toISOString()
      }

      // Add the employee record
      const result = await Employee.add(request)

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

app.post('/api/employee/update', async (req, res) => {
   try {
      if (!req.body || !req.body.position_id || !req.body.firstname_en || !req.body.firstname_th || !req.body.lastname_en || !req.body.lastname_th) {
         return res.status(400).json({
            RespCode: 400,
            RespMessage: 'Bad request'
         })
      }

      const id = req.body.id
      const request = {
         picture: req.body.picture || null,
         gender: req.body.gender || null,
         position_id: req.body.position_id,
         nametitle_th: req.body.nametitle_th || null,
         nametitle_en: req.body.nametitle_en || null,
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
         status_active: req.body.status_active,
         code_id: req.body.code_id || null,
         level_skill: req.body.level_skill || '',
         address: req.body.address || null,
         lastpassword: req.body.lastpassword || null
      }

      await Employee.doc(id).update(request)
      return res.status(200).json({
         RespCode: 200,
         RespMessage: 'Update'
      })
   } catch (error) {
      return res.status(500).json({
         RespCode: 500,
         RespMessage: error.message
      })
   }
})

app.post('/api/employee/update/active', async (req, res) => {
   try {
      if (!req.body) {
         return res.status(400).json({
            RespCode: 400,
            RespMessage: 'Bad request'
         })
      }
      const id = req.body.id
      await Employee.doc(id).update({ status_active: req.body.status_active })
      return res.status(200).json({
         RespCode: 200,
         RespMessage: 'Update'
      })
   } catch (error) {
      return res.status(500).json({
         RespCode: 500,
         RespMessage: error.message
      })
   }
})

app.post('/api/employee/delete', async (req, res) => {
   try {
      const id = req.body.id
      await Employee.doc(id).delete()
      return res.status(200).json({
         RespCode: 200,
         RespMessage: 'Deletee Success'
      })
   } catch (error) {
      return res.status(500).json({
         RespCode: 500,
         RespMessage: error.message
      })
   }
})

app.post('/api/authuser', async (req, res) => {
   try {
      if (!req.body.u || !req.body.p) {
         return res.status(400).json({
            RespCode: 400,
            RespMessage: 'Bad request'
         })
      }

      const snapshot = await Employee.get()
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      const query = list.filter((x) => x.email.toLowerCase() == req.body.u.toLowerCase())

      if (query.length > 0) {
         const data = query[0]

         if (req.body.p == data.lastpassword) {
            return res.status(200).json({
               RespCode: 200,
               RespMessage: data
            })
         } else {
            return res.status(404).json({
               RespCode: 404,
               RespMessage: 'เกิดข้อผิดพลาด'
            })
         }
      } else {
         return res.status(404).json({
            RespCode: 404,
            RespMessage: 'เกิดข้อผิดพลาด'
         })
      }
   } catch (error) {
      return res.status(500).json({
         RespCode: 500,
         RespMessage: error.message
      })
   }
})
// ===================== \MODULE EMPLOYEE/ =====================

module.exports = app
