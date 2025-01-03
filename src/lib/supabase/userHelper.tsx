import {v4 as uuid} from 'uuid';
import { NextResponse } from "next/server";
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../../supabase';

export async function pushUserToDataBase({name, email}: {name: string, email: string}){
    const userId = uuid();
    try{
        const {data : existingUser, error : userError} = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

        if(userError && userError.code != 'PGRST116'){
            return NextResponse.json({error: "Error while checking for existing user", details: userError}, {status: 500});
        }

        if(existingUser){
            if(existingUser.email !== email || existingUser.name !== name){
                const {error : updateError} = await supabase
                .from('users')
                .update({'name' : name, 'email' : email})
                .eq('email', email)
                .single();

                if(updateError){
                    return NextResponse.json({error: "Error while updating user", details: updateError}, {status: 500});
                }
            }
        }else{
            const {error : insertError} = await supabase
            .from('users')
            .insert([{id: userId, name: name, email: email}]);

            if(insertError){
                return NextResponse.json({error: "Error while inserting user", details: insertError}, {status: 500});
            }
        }
        return NextResponse.json({message: "User added to database"}, {status: 200});

        
    }catch(error){
        return NextResponse.json({error: "Error while adding user to database", details: error}, {status: 500});
    }

}