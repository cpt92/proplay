-- Replace placeholder pravatar headshots with curated, real-looking sports
-- action photos from Unsplash. Run this once in Supabase SQL Editor.

update public.athletes
set photo = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1000&fit=crop&q=80'
where id = '11111111-1111-1111-1111-111111111001'; -- Mike Branson — Hockey

update public.athletes
set photo = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=1000&fit=crop&q=80'
where id = '11111111-1111-1111-1111-111111111002'; -- Serena Hayes — Tennis

update public.athletes
set photo = 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&h=1000&fit=crop&q=80'
where id = '11111111-1111-1111-1111-111111111003'; -- Alex Rodriguez — Baseball

update public.athletes
set photo = 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=1000&fit=crop&q=80'
where id = '11111111-1111-1111-1111-111111111004'; -- Jordan Matthews — Basketball

update public.athletes
set photo = 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=1000&fit=crop&q=80'
where id = '11111111-1111-1111-1111-111111111005'; -- Emma Wilson — Soccer

update public.athletes
set photo = 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&h=1000&fit=crop&q=80'
where id = '11111111-1111-1111-1111-111111111006'; -- Marcus Thompson — Football/Training

update public.athletes
set photo = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop&q=80'
where id = '11111111-1111-1111-1111-111111111007'; -- Nicole Chen — Gymnastics/Fitness

update public.athletes
set photo = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=1000&fit=crop&q=80'
where id = '11111111-1111-1111-1111-111111111008'; -- David Park — Esports

-- Confirm
select name, sport, photo from public.athletes order by name;
