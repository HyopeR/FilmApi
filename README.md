# FilmApi
Node.js Film Api

# Authentication

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /authentication | `GET` | Empty | Authentication end pointlerini getir. |
| /authentication/login | `POST` | { username: 'Frog', password: 'FrogGuard' } | Üye girişi ve token alma. |
| /authentication/register | `POST` | { username: 'Frog', name: 'Jack', surname: 'July', email: 'julyjack@gmail.com', password: 'FrogGuard', active: true } | Üye kaydı gerçekleştire. |

# Services

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/services | `GET` | Empty | Services end pointlerini getir. |
| /api/services/video/vidmoly | `POST` | { url: 'vidmoly url' } | Mp4 dosyalarını getir. |

# Activities

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/activities | `GET` | Empty | Tüm activityleri listele. |
| /api/activities/active | `GET` | Empty | Tüm aktif activityleri listele. |
| /api/activities/:user_id/:content_detail_id | `GET` | Empty | Bir kullanıcının, bir contente göre olan activitysini getir. |
| /api/activities | `POST` | { content_detail_id: 1, is_one: true, activity_start: true, activity_finish: false, activity_score: false, activity_comment: false, activity_passing_time: '15.26', active: true } | Yeni bir activity oluştur. |
| /api/activities/:activity_id | `PUT` | { activity_start: true, activity_finish: false, activity_score: false, activity_comment: false, activity_passing_time: '15.26' } | Bir activityi güncelle. |
| /api/activities/:activity_id | `DELETE` | Empty | Bir activityi deaktif et. |
| /api/activities/scores/:user_id/:limit_number | `GET` | Empty | Bir kullanıcının arkadaşlarının content scorelarını listele. (Önce yeniler) |
| /api/activities/comments/:user_id/:limit_number | `GET` | Empty | Bir kullanıcının arkadaşlarının content commentslerini listele. (Önce yeniler) |

# Categories

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/categories | `GET` | Empty | Tüm categoryleri listele. |
| /api/categories/:category_id | `GET` | Empty | Id'sine göre category getir. |
| /api/categories | `POST` | { name: 'Aksiyon' } | Yeni bir category oluştur. |
| /api/categories/:category_id | `PUT` | { name: 'Aksiyon' } | Bir categoryi güncelle. |
| /api/categories/:category_id | `DELETE` | Empty | Bir categoryi kaydı sil. |

# Contents

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/contents | `GET` | Empty | Tüm contentleri listele. |
| /api/contents/active | `GET` | Empty | Tüm aktif contentleri listele. |
| /api/contents/:content_id | `GET` | Empty | Id'sine göre content getir. |
| /api/contents/change/type/:content_type_id | `GET` | Empty | Content typelarına göre contentlerini listele. (Dizi, Film) |
| /api/contents/change/category/:category_id | `GET` | Empty | Belirli bir categorydeki contentleri listele. (Macera, Aksiyon vs.) |
| /api/contents/change/special/:content_type_id/:category_id | `GET` | Empty | Content type ve categorylere göre contentleri listele. (Dizi-Aksiyon, Film-Dram vs.) |
| /api/contents | `POST` | { type_id: 1, tr_name: 'Bir şey', eng_name: 'Anything', imdb_score: 8.8, poster_url: 'jpg poster url', active: true } | Yeni bir content oluştur. |
| /api/contents/:content_id | `PUT` | { type_id: 1, tr_name: 'Bir şey', eng_name: 'Anything', imdb_score: 8.8, poster_url: 'jpg poster url', active: true } | Bir contenti güncelle. |
| /api/contents/:content_id | `DELETE` | Empty | Bir contenti deaktif et. |

# Contents Categories

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/contents/categories | `GET` | Empty | Tüm contents categoryleri listele. |
| /api/contents/categories/:content_id | `GET` | Empty | content_id'sine göre contents categoryleri getir. (Content kayıtlarının categories listesinin ayrıca getirilmesi.) |
| /api/contents/categories | `POST` | { content_id: 1, category_id: 1 } | Yeni bir contents categories oluştur. |
| /api/contents/categories/:content_id/:category_id | `PUT` | { content_id: 1, category_id: 1 } | Bir contents categoryi güncelle. |
| /api/contents/categories/:content_id/:category_id | `DELETE` | Empty | Bir contents categoryi sil. |

# Contents Details

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/contents/details | `GET` | Empty | Tüm contents detailleri listele. |
| /api/contents/details/:content_detail_id | `GET` | Empty | content_detail_id'sine göre contents detail getir. |
| /api/contents/details/series/:content_id | `GET` | Empty | content_id'sine göre tüm episodeleri gruplu getir. (Content kayıtlarının episodes listesinin ayrıca getirilmesi.) |
| /api/contents/details | `POST` | { content_id: 1, series_id: 1, url: 'vidmoly url', time: '1.58.23', intro_start_time: '0.30', intro_finish_time: '2.00' } | Yeni bir contents detail oluştur. |
| /api/contents/details/:content_detail_id | `PUT` | { content_id: 1, series_id: 1, url: 'vidmoly url', time: '1.58.23', intro_start_time: '0.30', intro_finish_time: '2.00' } | Bir contents detaili güncelle. |
| /api/contents/details/:content_detail_id | `DELETE` | Empty | Bir contents detaili sil. |

# Contents Types

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/contents/types | `GET` | Empty | Tüm contents typesleri listele. |
| /api/contents/types/:content_type_id | `GET` | Empty | Id'sine göre contents typeyi getir. |
| /api/contents/types | `POST` | { type_name: 'Dizi' } | Yeni bir contents type oluştur. |
| /api/contents/types/:content_type_id | `PUT` | { type_name: 'Dizi' } | Bir contents typeyi güncelle. |
| /api/contents/types/:content_type_id | `DELETE` | Empty | Bir contents typeyi sil. |

# Friends

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/friends | `GET` | Empty | Tüm friendsleri listele. |
| /api/friends/user/:user_id | `GET` | Empty | user_id'sine göre tüm friendleri ve diğer talepleri getir. (User kayıtlarının friends, sent_wait, receive_wait listelerinin ayrıca getirilmesi.) |
| /api/friends/:friend_record_id | `GET` | Empty | İki user arasıdaki friend kaydını friends.id'ye göre getir. |
| /api/friends | `POST` | { requester_id: 1, recipient_id: 2, status: 0 } | Friend isteği yollama. |
| /api/friends/:friend_record_id | `PUT` | { status: 1 } | Friend onaylama. |
| /api/friends/:friend_record_id | `DELETE` | Empty | Friend reddetme. |

# Rooms

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/rooms | `GET` | Empty | Tüm roomları listele. |
| /api/rooms/room_id | `GET` | Empty | Id'sine room kaydı getir. |
| /api/rooms | `POST` | { name: 'room1', active: true } | Yeni bir room oluştur. |
| /api/rooms/:room_id | `PUT` | { name: 'room2', active: true } | Bir room'u düzenle. |
| /api/rooms/:room_id| `DELETE` | Empty | Bir room'u deaktif et. |

# Rooms Activities

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/rooms/activities | `GET` | Empty | Tüm rooms activitylerini listele. |
| /api/rooms/activities/:room_id/:activity_id | `GET` | Empty | activity_id'sine göre rooms activity getir. |
| /api/rooms/activities | `POST` | { room_id: 1, activity_id: 1 } | Bir room activities oluştur. |

# Series

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/series | `GET` | Empty | Tüm seriesleri listele. |
| /api/series/:series_id | `GET` | Empty | Id'sine göre series getir. |
| /api/series/allSeason/:content_id | `GET` | Empty | content_id'ye ait olan tüm sezon bölümlerini getir. |
| /api/series/oneSeason/:content_id/:series_season | `GET` | Empty | content_id'ye göre belirlenen sezonda olan tüm bölümleri getir. |
| /api/series | `POST` | { content_id: 1, series_season: 1, tr_episode_name: 'Bölüm Adı', eng_episode_name: 'Episode Name', episode_number: 1 } | Bir bölüm oluştur. |
| /api/series/:series_id | `PUT` | { content_id: 1, series_season: 1, tr_episode_name: 'Bölüm Adı', eng_episode_name: 'Episode Name', episode_number: 1 } | Bir bölümü düzenle. |
| /api/series/:series_id| `DELETE` | Empty | Bir bölümü sil. |

# Users

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/users | `GET` | Empty | Tüm userları listele. |
| /api/users/active | `GET` | Empty | Tüm aktif userları listele. |
| /api/users/:user_id | `GET` | Empty | Id'sine göre user getir. |
| /api/users/:user_id | `PUT` | { username: 'Frog', name: 'Jack', surname: 'July', email: 'julyjack@gmail.com', password: 'FrogGuard', active: true } | Bir user düzenle. |
| /api/users/:user_id | `DELETE` | Empty | Bir useri deaktif et. |

# Users Activities

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/users/activities | `GET` | Empty | Tüm users activitylerini listele. |
| /api/users/activities/:user_id/:activity_id | `GET` | Empty | activity_id'sine göre user activity getir. |
| /api/users/activities | `POST` | { user_id: 1, activity_id: 2 } | Bir user activities oluştur. |

# Users Comments

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/users/comments | `GET` | Empty | Tüm commentsleri listele. |
| /api/users/comments/content/detail/:content_detail_id/:limit_number | `GET` | Empty | content_detail_id'ye göre içeriğe ait tüm yorumları listele. (Önce Yeni) |
| /api/users/comments/:user_comment_id | `GET` | Empty | Id'sine göre commenti getir. |
| /api/users/comments | `POST` | { user_id: 1, content_detail_id: 1, detail: 'Good movie.' } | Bir comment oluştur. |
| /api/users/comments/:user_comment_id | `PUT` | { detail: 'Very Good movie.' } | Bir commenti düzenle. |
| /api/users/comments/:user_comment_id | `DELETE` | Empty | Bir commenti sil. |

# Users Comments

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/users/lists | `GET` | Empty | Tüm kullanıcı izlenecek listelerini listele. |
| /api/users/lists/:user_id | `GET` | Empty | user_id'ye göre izlenecekler listesi getir. Users kayıtlarındaki lists'in ayrıca getirilmesi. |
| /api/users/lists | `POST` | { user_id: 1, content_id: 1 } | İzlenecekler listesine content ekle. |
| /api/users/lists/:user_id/:content_id | `DELETE` | Empty | İzlenecekler listesinden content sil. |

# Users Rooms

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/users/rooms | `GET` | Empty | Tüm users roomsları listele. |
| /api/users/rooms/userlist/:room_id | `GET` | Empty | room_id'ye göre roomdaki userların listesini getir. Rooms kayıtlarındaki user_lists listesinin ayrıca getirilmesi. |
| /api/users/rooms/roomlist/:user_id | `GET` | Empty | user_id'ye göre user'in bulunduğu tüm roomları getir. Users kayıtlarındaki room listesinin ayrıca getirilmesi. |
| /api/users/rooms/:user_id/:room_id | `GET` | Empty | user_id ve room_id users room ilişkisini getir. |
| /api/users/rooms | `POST` | { user_id: 1, room_id: 1, authority: 0 } | Bir user'ı bir room ile ilişkisini oluştur. |
| /api/users/rooms/:user_id/:room_id | `PUT` | { authority: 0 } | Bir user'ın roomdaki yetkisini değiştir. |
| /api/users/rooms/:user_id/:room_id | `DELETE` | Empty | Bir user'ın room ile ilişkisini sil. |

# Users Scores

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/users/scores | `GET` | Empty | Tüm users scoreları listele. |
| /api/users/scores/content/:content_id | `GET` | Empty | content_id'ye göre userların ortalama scoresini getir. Contents kayıtlarındaki users_mean_score'ın ayrıca getirilmesi. |
| /api/users/scores/:user_id/:content_id | `GET` | Empty | user_id ve content_id göre user'in scoresini getir. |
| /api/users/scores | `POST` | { user_id: 1, content_id: 1, score: 7.7 } | Bir contente puanlama oluştur. |
| /api/users/scores/:user_id/:content_id | `PUT` | { score: 8.0 } | Bir contente verilmiş puanlamayı değiştir. |
| /api/users/scores/:user_id/:content_id | `DELETE` | Empty | Bir user'ın bir contente verdiği scoreyi sil. |
