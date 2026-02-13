import { sql } from 'drizzle-orm'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  slug: text('slug').notNull().unique(),
  image: text('image'),
  link: text('link'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`,
  ),
})

export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  time: text('time'),
  description: text('description'),
  location: text('location'),
  type: text('type'), // entreno, competencia, social, cumpleaños, longrun, clase
  cost: text('cost'),
  classification: text('classification').default('public'), // public, team
  gpxUrl: text('gpx_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`,
  ),
})

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fullName: text('full_name').notNull(),
  idCard: text('id_card').notNull().unique(), // Cédula
  photoUrl: text('photo_url'),
  birthDate: text('birth_date'),
  gender: text('gender'),
  province: text('province'),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  password: text('password').notNull(),
  
  // Salud
  bloodType: text('blood_type'),
  allergies: text('allergies'),
  diseases: text('diseases'),
  pastInjuries: text('past_injuries'),
  currentInjuries: text('current_injuries'),
  
  // Composición corporal
  height: integer('height'),
  weight: integer('weight'),
  fatPercentage: integer('fat_percentage'),
  footwearType: text('footwear_type'),
  
  // Records Personales
  record5k: text('record_5k'),
  record10k: text('record_10k'),
  record21k: text('record_21k'),
  record42k: text('record_42k'),
  recordWkg: text('record_wkg'),
  strydUser: text('stryd_user'),
  finalSurgeUser: text('final_surge_user'),
  startDate: text('start_date'),

  isMember: integer('is_member', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`,
  ),
})

export const membershipRequests = sqliteTable('membership_requests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  
  // Objetivos
  trainingGoals: text('training_goals'), // Almacenado como JSON string
  shortTermGoal: text('short_term_goal'),
  mediumTermGoal: text('medium_term_goal'),
  longTermGoal: text('long_term_goal'),
  
  // Plan de Entreno
  trainingDaysPerWeek: text('training_days_per_week'),
  
  // Preguntas Varias
  hasTrainedWithStryd: text('has_trained_with_stryd'),
  hasStructuredTraining: text('has_structured_training'),
  discoveryMethod: text('discovery_method'),
  isAlreadyMember: integer('is_already_member', { mode: 'boolean' }).default(false),
  
  status: text('status').default('pending'), // pending, approved, rejected
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`,
  ),
})


export const gallery = sqliteTable('gallery', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  link: text('link'),
  displayOrder: integer('display_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`,
  ),
})
