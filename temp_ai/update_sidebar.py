import codecs

path = 'src/components/layout/Sidebar.tsx'
with codecs.open(path, 'r', 'utf-8') as f:
    content = f.read()

if 'Database' not in content:
    content = content.replace('Users,', 'Users, Database,')

old_str = "{ href: '/master/customers', icon: Users, tKey: 'items.customers' },"
new_str = old_str + "\n      { href: '/master/data-sync', icon: Database, tKey: 'items.dataSync' },"

content = content.replace(old_str, new_str)

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(content)
