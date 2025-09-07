import supabase from "../../supabase"
import { v4 } from "uuid"

export async function createStudentSession(user_id: string, oh_id: string, expires_at: Date) {
    try {
        const {data: sessionData, error: sessionError} = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user_id)
        .single()

        if(sessionError){
            if(sessionError.code === 'PGRST116'){
                // No session found, this is expected
                console.log('No existing session found')
            } else {
                // Unexpected error while reading from sessions table
                console.error('Error reading from sessions table:', sessionError)
                return { error: 'Failed to check existing session' }
            }
        }
        
        if(sessionData){
            const currentTime = new Date(Date.now())
            const expirationTime = new Date(sessionData.expires_at)
            
            if (expirationTime > currentTime) {
                console.log('Session is still valid')
                return sessionData
            }
            if (expirationTime > currentTime) {
                console.log('Session is still valid')
                return sessionData
            }
            
            // Update expired session with new expiration time
            const { data: updatedSession, error: updateError } = await supabase
                .from('sessions')
                .update({
                    expires_at,
                    is_valid: true
                })
                .eq('id', sessionData.id)
                .select()
                .single()

            if (updateError) {
                console.error('Error updating expired session:', updateError)
                return []
            }

            return updatedSession
        }
        
        // Create new session if no session exists
        const id = v4()

        const {data, error} = await supabase
        .from('sessions')
        .insert({
            id,user_id,expires_at,is_valid:true,oh_id
        })

        if(error){
            console.error('Error creating student session:', error)
            return []
        }

        return {id,user_id,expires_at,is_valid:true,oh_id}
        
    } catch (error) {
        console.error('Error creating student session:', error)
        return []
    }

    
}