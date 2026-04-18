import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

const ADMIN_EMAILS = ['apate934@gmail.com', 'rishpatelau@gmail.com']

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  if (userId && sessionClaims?.email) {
    const userEmail = (sessionClaims.email as string).toLowerCase()

    if (isAdminRoute(req) && !ADMIN_EMAILS.includes(userEmail)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
