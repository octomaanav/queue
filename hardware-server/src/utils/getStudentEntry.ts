import supabase from '../../supabase'

export async function getStudentEntry(cardNumber: string, lastName: string, personNumber: string) {
    try {
        const {data, error} =  await supabase
        .from('cards')
        .select('*')
        .eq('card_number', cardNumber)
        .eq('person_number', personNumber)

        if(error){
            console.error('Error fetching student entry:', error)
            return []
        }

        if(data.length === 0 || data.length > 1){
            console.error('No student entry found')
            return []
        }

        const {student_name, student_email} = data[0]

        if(! student_name.toLowerCase().includes(lastName.toLowerCase())){
            console.error('Student name does not match last name')  
            return []
        }

        const {data: userData, error: userError} = await supabase
        .from('users')
        .select('*')
        .eq('email', student_email)
        .eq('name', student_name)

        if(userError){
            console.error('Error fetching user entry:', userError)
            return []
        }

        if(userData.length === 0 || userData.length > 1){
            console.error('No user entry found')
            return []
        }
    
        return userData


    } catch (error) {
        console.error('Error fetching student entry:', error)
        throw error
    }
}


