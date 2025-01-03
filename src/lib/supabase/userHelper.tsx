import {v4 as uuid} from 'uuid';
import { NextResponse } from "next/server";
import { initialize, getSupabaseClient } from '../../../supabase';

export async function pushUserToDataBase({name, email, access_token}: {name: string, email: string, access_token:string}){
    const userId = uuid();
    await initialize({access_token});
    const supabase  = getSupabaseClient();

    if (!supabase) {
        return NextResponse.json({error: "Supabase client is not initialized"}, {status: 500});
    }

    const {error : insertError} = await supabase
            .from('users')
            .insert([{id: userId, name: name, email: email}]);

    

    // try{
    //     const {data : existingUser, error : userError} = await supabase
    //     .from('users')
    //     .select('*')
    //     .eq('email', email)
    //     .single();

    //     if(userError && userError.code != 'PGRST116'){
    //         return NextResponse.json({error: "Error while checking for existing user", details: userError}, {status: 500});
    //     }

    //     if(existingUser){
    //         if(existingUser.email !== email || existingUser.name !== name){
    //             const {error : updateError} = await supabase
    //             .from('users')
    //             .update({'name' : name, 'email' : email})
    //             .eq('email', email)
    //             .single();

    //             if(updateError){
    //                 return NextResponse.json({error: "Error while updating user", details: updateError}, {status: 500});
    //             }
    //         }
    //     }else{
    //         const {error : insertError} = await supabase
    //         .from('users')
    //         .insert([{id: userId, name: name, email: email}]);

    //         if(insertError){
    //             return NextResponse.json({error: "Error while inserting user", details: insertError}, {status: 500});
    //         }
    //     }
    //     return NextResponse.json({message: "User added to database"}, {status: 200});

        
    // }catch(error){
    //     return NextResponse.json({error: "Error while adding user to database", details: error}, {status: 500});
    // }

}