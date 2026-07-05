import psycopg2
conn = psycopg2.connect('postgresql://postgres:postgres@localhost:54322/postgres')
cur = conn.cursor()
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'jobs'")
print([r[0] for r in cur.fetchall()])
