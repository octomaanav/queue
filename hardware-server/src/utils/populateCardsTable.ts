import { parse } from 'csv-parse'
import fs from 'fs'
import supabase from '../../supabase'

export async function populateCardsTable() {
    try {
        const csvFilePath = '../../data/cards.csv'
        const records: any[] = []
        
        const parser = fs.createReadStream(csvFilePath)
            .pipe(parse({
                columns: true,
                skip_empty_lines: true
            }))
            
        for await (const record of parser) {
            records.push(record)
        }
        
        records.forEach(async (record) => {
            try {
                const { card_number, person_number, student_name, student_email } = record
                const { data, error } = await supabase
                .from('cards')
                .insert({
                    card_number, person_number, student_name, student_email
                })
                if (error) {console.error('Error reading card information', error)}
                console.log(data)
            } catch (error) {
                console.error('Error inserting card:', error)
                return []
            }
        })

        return records

    } catch (error) {
        console.error('Error populating cards table:', error)
        throw error
    }
}