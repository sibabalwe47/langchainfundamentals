import { createClient } from '@supabase/supabase-js'
import { chatCGPTEmbeddings } from './models.js'
import { API_URL, API_KEY, TABLE_NAME, QUERY_NAME } from './config.js'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'

const client = createClient(API_URL, API_KEY);

const supabaseVectorStore = new SupabaseVectorStore(chatCGPTEmbeddings, {
    client,
    tableName: TABLE_NAME,
    queryName: QUERY_NAME
});

export const supabaseRetriever = supabaseVectorStore.asRetriever();
