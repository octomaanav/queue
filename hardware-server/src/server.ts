import express, { Request, Response } from 'express'
import dotenv from 'dotenv';
import { getStudentEntry } from './utils/getStudentEntry';
import { populateCardsTable } from './utils/populateCardsTable';
import { createStudentSession } from './utils/createStudentSession';
import { getOfficeHoursID } from './utils/getOfficeHoursID';

dotenv.config();

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json()) 

// Helper function to decode the student code
function decodeStudentCode(studentCode : string) {
  // Check if the studentCode matches the expected format
  if (!studentCode || !studentCode.includes("^")) {
    throw new Error('Invalid studentCode format')
  }

  let code = studentCode.split("^")
  
  // Check for valid parts
  if (code.length < 3) {
    throw new Error('Incomplete studentCode information')
  }

  const cardNumber = code[0].slice(2)
  const lastName = code[1].split(".")[0].split("/")[0].trim()
  console.log(lastName)
  // const personNumber = code[2].slice(14, 22)

  const regex = /(?<=0000000)(\d{8})(?=0000000)/;
    
  const personNumberCode = studentCode.match(regex);
  const personNumber = personNumberCode ? personNumberCode[1] : ""

  return { cardNumber, lastName, personNumber }
}


app.post('/', async (req: Request, res: Response) => {
  try {
    const { studentCode, readerId } = req.body
    
    // Validate that required fields are present
    if (!studentCode || !readerId) {
      res.status(400).json({
        message: !studentCode ? 'Missing studentCode' : 'Missing readerId'
      })
      return
    }

    // Decode student code
    const { cardNumber, lastName, personNumber } = decodeStudentCode(studentCode)

    if(cardNumber.length !== 16 || lastName.length == 0 || personNumber.length !== 8){
      res.status(400).json({
        message: 'Invalid studentCode format'
      })
      return
    }

    const studentEntry = await getStudentEntry(cardNumber, lastName, personNumber)
    const {id} = studentEntry[0]
    const officeHoursID = await getOfficeHoursID(readerId)

    const session = await createStudentSession(id, officeHoursID, new Date(Date.now() + 1000 * 60 * 10))
    console.log(session)
    res.json({ cardNumber, lastName, personNumber, readerId })
    
  } catch (err : any) {

    console.error('Error occurred:', err.message)


    if (err.message.includes('Invalid studentCode format')) {
      res.status(400).json({ message: 'Invalid studentCode format' })
    } else if (err.message.includes('Incomplete studentCode information')) {
      res.status(400).json({ message: 'Incomplete studentCode information' })
    } else {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

