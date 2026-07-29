import { getUsers } from '@/app/_lib/db'
import { createSession } from '@/app/_lib/auth'
import { LoginSchema } from '@/app/_lib/definitions'

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = LoginSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { email, password } = parsed.data
  const users = await getUsers()
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return Response.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  return Response.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
}
