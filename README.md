# FilmApi
Node.js Film Api

# Activities

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/activities | `GET` | Empty | Tüm activityleri listele. |
| /api/activities/active | `GET` | Empty | Tüm aktif activityleri listele. |
| /api/activities/:user_id/:content_detail_id | `GET` | Empty | Bir kullanıcının, bir contente göre olan activitysini getir. |
| /api/activities | `POST` | { content_detail_id: 1,
is_one: true,
activity_start: true,
activity_finish: false,
activity_score: false,
activity_comment: false,
activity_passing_time: '15.26',
active: true } | Yeni bir activity oluştur. |
| /api/activities/:activity_id | `PUT` | { activity_start: true,
activity_finish: false,
activity_score: false,
activity_comment: false,
activity_passing_time: '15.26' } | Bir activityi güncelle. |
| /api/activities/:activity_id | `DELETE` | Empty | Bir activityi deaktif et. |
| /api/activities/scores/:user_id/:limit_number | `GET` | Empty | Bir kullanıcının arkadaşlarının content scorelarını listele. (Önce yeniler) |
| /api/activities/comments/:user_id/:limit_number | `GET` | Empty | Bir kullanıcının arkadaşlarının content commentslerini listele. (Önce yeniler) |
