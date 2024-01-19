/* eslint-disable */
export default async () => {
    const t = {
        ["./bucket/entities/bucket.entity"]: await import("./bucket/entities/bucket.entity"),
        ["./asset/entities/asset.entity"]: await import("./asset/entities/asset.entity"),
        ["./user/entities/user.entity"]: await import("./user/entities/user.entity"),
        ["./oauth-application/entities/support-oauth.application"]: await import("./oauth-application/entities/support-oauth.application"),
        ["./oauth-application/entities/oauth-application.entity"]: await import("./oauth-application/entities/oauth-application.entity"),
        ["./user/entities/menu.entity"]: await import("./user/entities/menu.entity"),
        ["./common/decorator/permissions.decorator"]: await import("./common/decorator/permissions.decorator"),
        ["./user/entities/role.entity"]: await import("./user/entities/role.entity"),
        ["./user/entities/family.entity"]: await import("./user/entities/family.entity"),
        ["./oauth-openid/entities/oauth-openid.entity"]: await import("./oauth-openid/entities/oauth-openid.entity"),
        ["./post/entities/post-log.entity"]: await import("./post/entities/post-log.entity"),
        ["./post/entities/post.entity"]: await import("./post/entities/post.entity"),
        ["./web-push/dto/PushSubscriptionJSON.dto"]: await import("./web-push/dto/PushSubscriptionJSON.dto"),
        ["./feed/entities/feed.entity"]: await import("./feed/entities/feed.entity"),
        ["./request-log/dto/request-log.dto"]: await import("./request-log/dto/request-log.dto"),
        ["./web-push/entities/push-subscription-log.entity"]: await import("./web-push/entities/push-subscription-log.entity")
    };
    return { "@nestjs/swagger": { "models": [[import("./tencent-cloud-account/entities/tencent-cloud-account.entity"), { "TencentCloudAccount": { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, SecretId: { required: true, type: () => String }, SecretKey: { required: true, type: () => String }, AppId: { required: true, type: () => String }, buckets: { required: true, type: () => [t["./bucket/entities/bucket.entity"].CosBucket] } } }], [import("./bucket/entities/bucket.entity"), { "CosBucket": { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, Bucket: { required: true, type: () => String }, Region: { required: true, type: () => String }, ACL: { required: true, type: () => Object }, CORSRules: { required: true, type: () => [Object] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, tencentCloudAccount: { required: true, type: () => Object }, assets: { required: true, type: () => [t["./asset/entities/asset.entity"].Asset] }, public: { required: true, type: () => Boolean } } }], [import("./asset/entities/asset.entity"), { "Asset": { id: { required: true, type: () => Number }, bucket: { required: true, type: () => t["./bucket/entities/bucket.entity"].CosBucket }, objectUrl: { required: true, type: () => ({ webp: { required: true, type: () => String }, original: { required: true, type: () => String }, thumbnail_300_: { required: true, type: () => String }, thumbnail_700_: { required: true, type: () => String }, thumbnail_blur_: { required: true, type: () => String } }) }, originUrl: { required: true, type: () => String }, sn: { required: true, type: () => String }, tags: { required: true, type: () => [String] }, comment: { required: true, type: () => String }, fileSuffix: { required: true, type: () => String }, sha1: { required: true, type: () => String }, pHash: { required: true, type: () => String }, exif: { required: true, type: () => Object, nullable: true }, alt: { required: true, type: () => String }, size: { required: true, type: () => ({ width: { required: true, type: () => Number }, height: { required: true, type: () => Number } }) }, uploadBy: { required: true, type: () => t["./user/entities/user.entity"].User }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./oauth-application/entities/oauth-application.entity"), { "OauthApplication": { id: { required: true, type: () => Number }, platformName: { required: true, enum: t["./oauth-application/entities/support-oauth.application"].SupportOauthApplication }, clientId: { required: true, type: () => String }, clientSecret: { required: true, type: () => String }, callbackUrl: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./oauth-openid/entities/oauth-openid.entity"), { "OauthOpenid": { id: { required: true, type: () => Number }, application: { required: true, type: () => t["./oauth-application/entities/oauth-application.entity"].OauthApplication }, openid: { required: true, type: () => String }, user: { required: true, type: () => t["./user/entities/user.entity"].User }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./user/entities/family.entity"), { "Family": { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, description: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, members: { required: true, type: () => [t["./user/entities/user.entity"].User] } } }], [import("./user/entities/menu.entity"), { "Menu": { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, path: { required: true, type: () => String }, children: { required: true, type: () => [t["./user/entities/menu.entity"].Menu] }, parent: { required: true, type: () => t["./user/entities/menu.entity"].Menu }, parentId: { required: true, type: () => Number, nullable: true }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./user/entities/role.entity"), { "Role": { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, menus: { required: true, type: () => [t["./user/entities/menu.entity"].Menu] }, permissions: { required: true, enum: t["./common/decorator/permissions.decorator"].Permission, isArray: true } } }], [import("./user/entities/user.entity"), { "User": { id: { required: true, type: () => Number }, email: { required: true, type: () => String }, saltedPassword: { required: true, type: () => String }, salt: { required: true, type: () => String }, nickname: { required: true, type: () => String }, bio: { required: true, type: () => String }, avatar: { required: false, type: () => String }, lastIp: { required: true, type: () => String }, lastAddress: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, timelineBackground: { required: true, type: () => t["./asset/entities/asset.entity"].Asset }, roles: { required: true, type: () => [t["./user/entities/role.entity"].Role] }, families: { required: true, type: () => [t["./user/entities/family.entity"].Family] }, oauthOpenidArr: { required: true, type: () => [t["./oauth-openid/entities/oauth-openid.entity"].OauthOpenid] } } }], [import("./tools/dto/OCR.dto"), { "OCRDto": { images: { required: true, type: () => [Object] } } }], [import("./tencent-cloud-account/dto/create-tencent-cloud-account.dto"), { "CreateTencentCloudAccountDto": { name: { required: true, type: () => String }, SecretId: { required: true, type: () => String }, SecretKey: { required: true, type: () => String }, AppId: { required: true, type: () => String } } }], [import("./bucket/dto/create-bucket.dto"), { "CreateBucketDto": { name: { required: true, type: () => String }, Region: { required: true, type: () => String }, tencentCloudAccount: { required: true, type: () => Object } } }], [import("./oauth-application/dto/create-oauth-application.dto"), { "CreateOauthApplicationDto": { platformName: { required: true, enum: t["./oauth-application/entities/support-oauth.application"].SupportOauthApplication }, clientId: { required: true, type: () => String }, clientSecret: { required: true, type: () => String }, callbackUrl: { required: true, type: () => String } } }], [import("./user/dto/edit-user.dto"), { "EditUserDto": { email: { required: true, type: () => String }, nickname: { required: true, type: () => String }, bio: { required: true, type: () => String }, avatar: { required: false, type: () => String } } }], [import("./user/dto/query-users.dto"), { "QueryUsersDto": { createdAt: { required: false }, updatedAt: { required: false } } }], [import("./user/dto/user-login.dto"), { "UserLoginDto": { password: { required: true, type: () => String } } }], [import("./user/dto/create-role.dto"), { "CreateRoleDto": { name: { required: true, type: () => String }, menus: { required: false, type: () => [Number] } } }], [import("./user/dto/query-roles.dto"), { "QueryRolesDto": { createdAt: { required: false }, updatedAt: { required: false } } }], [import("./user/dto/query-menus.dto"), { "QueryMenusDto": { createdAt: { required: false }, updatedAt: { required: false } } }], [import("./asset/dto/query-assets.dto"), { "QueryAssetsDto": { createdAt: { required: false }, updatedAt: { required: false } } }], [import("./baby/baby.dto"), { "CreateBabyMomentDto": {}, "CreateBabyBucketDto": {}, "CreateBabyEventDto": {}, "UpdateBabyEventDto": {}, "CreateBabyEventLogDto": {}, "UpdateBabyEventLogDto": {}, "QueryBabyEventLogDto": {} }], [import("./request-log/entities/request-log.entity"), { "RequestLog": { id: { required: true, type: () => Number }, path: { required: true, type: () => String }, ip: { required: true, type: () => String }, ipInfo: { required: true, type: () => String }, method: { required: true, type: () => String }, statusCode: { required: true, type: () => Number }, contentLength: { required: true, type: () => String }, processTime: { required: true, type: () => String }, referer: { required: true, type: () => String }, userAgent: { required: true, type: () => String }, requestId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./request-log/dto/query-request-log.dto"), { "QueryRequestLogDto": { createdAt: { required: true }, updatedAt: { required: true } } }], [import("./request-log/dto/request-log.dto"), { "RequestLogDto": { createdAt: { required: true, type: () => String }, requestCount: { required: true, type: () => Number }, distinctIpCount: { required: true, type: () => Number } } }], [import("./feed/entities/feed.entity"), { "Feed": { id: { required: true, type: () => Number }, content: { required: true, type: () => String }, assets: { required: true, type: () => [t["./asset/entities/asset.entity"].Asset] }, public: { required: true, type: () => Boolean }, createBy: { required: true, type: () => t["./user/entities/user.entity"].User }, updateBy: { required: true, type: () => t["./user/entities/user.entity"].User }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./feed/dto/query-feeds.dto"), { "QueryFeedsDto": {} }], [import("./feed/dto/create-feed.dto"), { "CreateFeedDto": { content: { required: true, type: () => String }, public: { required: false, type: () => Boolean } } }], [import("./feed/dto/update-feed.dto"), { "UpdateFeedDto": { id: { required: true, type: () => Number }, content: { required: true, type: () => String }, public: { required: true, type: () => Boolean } } }], [import("./feed/dto/specific-feed.dto"), { "SpecificFeedDto": { id: { required: true, type: () => Number } } }], [import("./post/entities/post.entity"), { "Post": { id: { required: true, type: () => Number }, title: { required: true, type: () => String }, content: { required: true, type: () => String }, summary: { required: true, type: () => String }, tags: { required: true, type: () => [String] }, public: { required: true, type: () => Boolean }, publishYear: { required: true, type: () => Number }, createBy: { required: true, type: () => t["./user/entities/user.entity"].User }, updateBy: { required: true, type: () => t["./user/entities/user.entity"].User }, poster: { required: true, type: () => t["./asset/entities/asset.entity"].Asset }, logs: { required: true, type: () => [t["./post/entities/post-log.entity"].PostLog] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./post/entities/post-log.entity"), { "PostLog": { id: { required: true, type: () => Number }, post: { required: true, type: () => t["./post/entities/post.entity"].Post }, title: { required: true, type: () => String }, content: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./post/dto/query-posts.dto"), { "QueryPostsDto": { createdAt: { required: true }, updatedAt: { required: true } } }], [import("./post/dto/create-post.dto"), { "CreatePostDto": { title: { required: true, type: () => String }, content: { required: true, type: () => String }, posterId: { required: false, type: () => Number } } }], [import("./post/dto/patch-post.dto"), { "PatchPostDto": { id: { required: true, type: () => Number }, title: { required: true, type: () => String }, content: { required: true, type: () => String }, posterId: { required: false, type: () => Number } } }], [import("./post/dto/search-post.dto"), { "SearchPostDto": { publishYear: { required: false, type: () => Number } } }], [import("./click-up/entities/click-up.entity"), { "ClickUpList": { exampleField: { required: true, type: () => Number } } }], [import("./web-push/dto/PushSubscriptionJSON.dto"), { "PushSubscriptionJSONDto": { endpoint: { required: true, type: () => String }, expirationTime: { required: false, type: () => Number }, keys: { required: true } } }], [import("./web-push/entities/push-subscription-log.entity"), { "PushSubscriptionLog": { id: { required: true, type: () => Number }, pushSubscriptionJSON: { required: true, type: () => t["./web-push/dto/PushSubscriptionJSON.dto"].PushSubscriptionJSONDto }, endpoint: { required: true, type: () => String }, user: { required: false, type: () => t["./user/entities/user.entity"].User }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./web-push/dto/Notification.dto"), { "NotificationDto": { title: { required: true, type: () => String }, message: { required: true, type: () => String }, icon: { required: false, type: () => String }, openUrl: { required: false, type: () => String }, subscribeId: { required: true, type: () => Number } } }], [import("./libs/word-book/entities/word-book.entity"), { "WordBook": { id: { required: true, type: () => Number }, word: { required: true, type: () => String }, translation: { required: true, type: () => String }, phonetic: { required: true, type: () => String }, audio: { required: true, type: () => String }, example: { required: true, type: () => String }, exampleTranslation: { required: true, type: () => String }, exampleAudio: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./oauth-application/dto/update-oauth-application.dto"), { "UpdateOauthApplicationDto": {} }], [import("./oauth-openid/dto/create-oauth-openid.dto"), { "CreateOauthOpenidDto": {} }], [import("./oauth-openid/dto/update-oauth-openid.dto"), { "UpdateOauthOpenidDto": {} }], [import("./tencent-cloud-account/dto/update-tencent-cloud-account.dto"), { "UpdateTencentCloudAccountDto": {} }]], "controllers": [[import("./tools/tools.controller"), { "ToolsController": { "download": { type: Object }, "cookies": {}, "readCookies": { type: String }, "ocr": { type: String }, "compress": {} } }], [import("./tencent-cloud-account/tencent-cloud-account.controller"), { "TencentCloudAccountController": { "addAccount": {} } }], [import("./bucket/bucket.controller"), { "BucketController": { "listAllBuckets": { type: [t["./bucket/entities/bucket.entity"].CosBucket] }, "createNewBucket": { type: Object }, "backup": { type: [Object] } } }], [import("./user/user-manage.controller"), { "UserManageController": { "queryUsers": {}, "queryUserById": { type: t["./user/entities/user.entity"].User }, "editUserById": {} } }], [import("./user/menu/menu.controller"), { "MenuController": { "queryMenus": {}, "queryAllMenus": { type: [t["./user/entities/menu.entity"].Menu] }, "queryMenuById": { type: t["./user/entities/menu.entity"].Menu }, "createMenu": { type: Object }, "editMenu": { type: Object }, "deleteMenuById": {} } }], [import("./user/role/role.controller"), { "RoleController": { "queryRoles": {}, "queryRoleById": { type: t["./user/entities/role.entity"].Role }, "createRole": { type: Object }, "updateRole": { type: Object }, "deleteRoleById": {}, "listPermissions": { type: [Object] } } }], [import("./user/user.controller"), { "UserController": { "googleAuth": {}, "githubAuth": {}, "googleAuthCallback": {}, "githubAuthCallback": {}, "login": {}, "current": { type: Object }, "logout": {}, "queryCurrentUserMenus": { type: [t["./user/entities/menu.entity"].Menu] } } }], [import("./asset/asset.controller"), { "AssetController": { "queryAssets": {}, "pHashMap": { type: Object }, "saveAssetToBucket": { type: [t["./asset/entities/asset.entity"].Asset] }, "deleteAsset": {}, "addAlt": {}, "backupAzuki": {} } }], [import("./baby/baby.controller"), { "BabyController": { "queryMoments": {}, "createMoment": {}, "createBucket": {}, "upload": {}, "createEvent": {}, "queryEvent": {}, "updateEvent": {}, "createEventLog": {}, "queryEventLog": {}, "updateEventLog": {}, "deleteEventLog": {}, "queryDistinctEventLog": {} } }], [import("./fcm/fcm.controller"), { "FcmController": { "subscribe": {} } }], [import("./feed/feed-manage.controller"), { "FeedManageController": { "queryFeeds": {}, "deleteFeedById": {} } }], [import("./feed/feed.controller"), { "FeedController": { "create": { type: t["./feed/entities/feed.entity"].Feed }, "update": { type: t["./feed/entities/feed.entity"].Feed }, "remove": {} } }], [import("./libs/github/github.controller"), { "GithubController": { "getUserInfo": {} } }], [import("./libs/wechat/official-account.controller"), { "OfficialAccountController": { "checkSignature": {}, "handleOfficialAccountMessage": {} } }], [import("./libs/wechat/mini-program.controller"), { "MiniProgramController": { "checkSignature": {}, "handleMessage": {}, "code2Session": { type: Object }, "getUnlimitedQRCode": {} } }], [import("./microservice/handleAsset/upload-asset.controller"), { "UploadAssetController": { "hello": { type: String }, "getNotifications": { type: Object }, "handleFeed": { type: Object } } }], [import("./post/post-manage.controller"), { "PostManageController": { "queryPosts": {} } }], [import("./post/post.controller"), { "PostController": { "createPost": { type: t["./post/entities/post.entity"].Post }, "updatePost": { type: t["./post/entities/post.entity"].Post }, "deletePost": {} } }], [import("./request-log/request-log.controller"), { "RequestLogController": { "queryLogs": {} } }], [import("./public/public.controller"), { "PublicController": { "hello": { type: String }, "queryPublicPosts": {}, "queryPublicPostYears": { type: [Object] }, "queryPublicPostTags": {}, "queryPublicPostById": { type: t["./post/entities/post.entity"].Post }, "infiniteQueryPublicTimeline": {}, "infiniteQueryPublicAsset": {}, "getPublicAssetById": { type: t["./asset/entities/asset.entity"].Asset }, "viewCount": { type: [t["./request-log/dto/request-log.dto"].RequestLogDto] } } }], [import("./public/random.controller"), { "RandomController": { "getAvatar": {} } }], [import("./schedule/schedule.controller"), { "ScheduleController": { "RunScheduleByRequest": { type: String } } }], [import("./web-push/web-push.controller"), { "WebPushController": { "subscribe": { type: t["./web-push/entities/push-subscription-log.entity"].PushSubscriptionLog }, "list": {}, "sendNotification": {} } }]] } };
};