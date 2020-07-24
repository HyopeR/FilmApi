# FilmApi
Node.js Film Api

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
| /api/categories | `POST` | { name: "Aksiyon" } | Yeni bir category oluştur. |
| /api/categories/:category_id | `PUT` | { name: "Aksiyon" } | Bir categoryi güncelle. |
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
| /api/contents | `POST` | { type_id: 1, tr_name: "Anything", eng_name: "Anything", imdb_score: 8.8, active: true } | Yeni bir content oluştur. |
| /api/contents/:content_id | `PUT` | { type_id: 1, tr_name: "Anything", eng_name: "Anything", imdb_score: 8.8, active: true } | Bir contenti güncelle. |
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
| /api/contents/details | `POST` | { content_id: 1, series_id: 1, url: "vidmoly url", time: "1.58.23", intro_start_time: "0.30", intro_finish_time: "2.00" } | Yeni bir contents detail oluştur. |
| /api/contents/details/:content_detail_id | `PUT` | { content_id: 1, series_id: 1, url: "vidmoly url", time: "1.58.23", intro_start_time: "0.30", intro_finish_time: "2.00" } | Bir contents detaili güncelle. |
| /api/contents/details/:content_detail_id | `DELETE` | Empty | Bir contents detaili sil. |
