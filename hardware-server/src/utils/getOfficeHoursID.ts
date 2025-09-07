import supabase from "../../supabase"

export async function getOfficeHoursID(reader_id: string) {
    try {
        const { data, error } = await supabase
        .from("schedules")
        .select("id")
        .eq("reader_id", reader_id)
        .single()
        
        if(error){
            console.error("Error getting office hours ID", error)
            return null
        }
        return data.id
    } catch (error) {
        
    }
}