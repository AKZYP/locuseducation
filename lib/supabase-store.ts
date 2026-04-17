'use client'

import { supabase } from './supabase'
import type { Video, Resource, LiveStream } from './types'

// Videos
export async function getVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('date_added', { ascending: false })
  
  if (error) {
    console.error('Error fetching videos:', JSON.stringify(error, null, 2))
    return []
  }
  
  return data?.map(v => ({
    id: v.id,
    title: v.title,
    youtubeUrl: v.youtube_url,
    topic: v.topic,
    unit: v.unit,
    subject: v.subject,
    description: v.description,
    dateAdded: v.date_added
  })) || []
}

export async function addVideo(video: Omit<Video, 'id' | 'dateAdded'>): Promise<Video | null> {
  const { data, error } = await supabase
    .from('videos')
    .insert({
      title: video.title,
      youtube_url: video.youtubeUrl,
      topic: video.topic,
      unit: video.unit,
      subject: video.subject,
      description: video.description
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error adding video:', JSON.stringify(error, null, 2))
    return null
  }
  
  return {
    id: data.id,
    title: data.title,
    youtubeUrl: data.youtube_url,
    topic: data.topic,
    unit: data.unit,
    subject: data.subject,
    description: data.description,
    dateAdded: data.date_added
  }
}

export async function deleteVideo(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting video:', JSON.stringify(error, null, 2))
    return false
  }
  
  return true
}

// Resources
export async function getResources(): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('date_added', { ascending: false })
  
  if (error) {
    console.error('Error fetching resources:', JSON.stringify(error, null, 2))
    return []
  }
  
  return data?.map(r => ({
    id: r.id,
    title: r.title,
    description: r.description,
    fileUrl: r.file_url,
    fileName: r.file_name,
    topic: r.topic,
    unit: r.unit,
    subject: r.subject,
    dateAdded: r.date_added
  })) || []
}

export async function addResource(resource: Omit<Resource, 'id' | 'dateAdded'>): Promise<Resource | null> {
  const { data, error } = await supabase
    .from('resources')
    .insert({
      title: resource.title,
      description: resource.description,
      file_url: resource.fileUrl,
      file_name: resource.fileName,
      topic: resource.topic,
      unit: resource.unit,
      subject: resource.subject
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error adding resource:', JSON.stringify(error, null, 2))
    return null
  }
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    fileUrl: data.file_url,
    fileName: data.file_name,
    topic: data.topic,
    unit: data.unit,
    subject: data.subject,
    dateAdded: data.date_added
  }
}

export async function deleteResource(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting resource:', JSON.stringify(error, null, 2))
    return false
  }
  
  return true
}

// Livestream
export async function getLiveStream(): Promise<LiveStream | null> {
  const { data, error } = await supabase
    .from('livestreams')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error) {
    if (error.code !== 'PGRST116') { // No rows returned
      console.error('Error fetching livestream:', JSON.stringify(error, null, 2))
    }
    return null
  }
  
  return {
    id: data.id,
    title: data.title,
    scheduledDate: data.scheduled_date,
    youtubeUrl: data.youtube_url,
    description: data.description
  }
}

export async function saveLiveStream(stream: Omit<LiveStream, 'id'>): Promise<LiveStream | null> {
  // Delete existing livestreams (only keep one)
  await supabase.from('livestreams').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  
  const { data, error } = await supabase
    .from('livestreams')
    .insert({
      title: stream.title,
      scheduled_date: stream.scheduledDate,
      youtube_url: stream.youtubeUrl,
      description: stream.description
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error saving livestream:', JSON.stringify(error, null, 2))
    return null
  }
  
  return {
    id: data.id,
    title: data.title,
    scheduledDate: data.scheduled_date,
    youtubeUrl: data.youtube_url,
    description: data.description
  }
}

export async function addEmailSubscriber(email: string, subject: string): Promise<{ success: boolean; alreadyExists: boolean }> {
  const { error } = await supabase
    .from('email_subscribers')
    .insert({ email, subject })

  if (error) {
    if (error.code === '23505') return { success: true, alreadyExists: true }
    console.error('Error adding subscriber:', JSON.stringify(error, null, 2))
    return { success: false, alreadyExists: false }
  }
  return { success: true, alreadyExists: false }
}

export async function removeEmailSubscriber(email: string): Promise<{ success: boolean; notFound: boolean }> {
  // Check if exists first
  const { data } = await supabase
    .from('email_subscribers')
    .select('email')
    .eq('email', email)
    .single()

  if (!data) return { success: false, notFound: true }

  const { error } = await supabase
    .from('email_subscribers')
    .delete()
    .eq('email', email)

  if (error) {
    console.error('Error removing subscriber:', JSON.stringify(error, null, 2))
    return { success: false, notFound: false }
  }
  return { success: true, notFound: false }
}

export function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}
