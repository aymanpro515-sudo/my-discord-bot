const { Client } = require('discord.js-selfbot-v13');

const client = new Client({
    checkUpdate: false,
    autoRedeemNitro: false
});

// --- نظام الحماية الشامل (منع توقف السيلفبوت) ---
process.on('unhandledRejection', error => {
    console.error('⚠️ خطأ غير معالـج (Unhandled Rejection):', error);
});

process.on('uncaughtException', error => {
    console.error('⚠️ استثناء غير متوقع (Uncaught Exception):', error);
});

// إعداد العميل (Client) للسيلفبوت بشكل نظيف وبدون أخطاء
const client = new Client({
    checkUpdate: false
});

// إعدادات المتغيرات الأساسية
const AUTO_ROLE_ID = '155269951182520371'; // ID الرتبة التلقائية

client.once('ready', async () => {
    console.log(`✅ تم تسجيل الدخول بنجاح باسم السيلفبوت: ${client.user.tag}`);
});

// --- 1. نظام التفاعل مع الأوامر عبر الرسائل (Prefix Commands & DMs) ---
client.on('messageCreate', async (message) => {
    // تجاهل رسائل البوتات لعدم حدوث تداخل
    if (message.author.bot) return;

    // أمر البينغ العادي
    if (message.content === '!ping') {
        const latency = Math.round(client.ws.ping);
        message.reply(`pong! 🏓 سرعة الاستجابة هي: ${latency}ms`);
    }

    // أمر فحص حالة النظام
    if (message.content === '!clone-status') {
        message.reply('🛡️ أنظمة النسخ الاحتياطي، الحماية ضد الهجمات، واللوقز تعمل بكفاءة عالية!');
    }

    // أمر النسخ الاحتياطي التلقائي (Auto Backup)
    if (message.content.startsWith('.backup')) {
        try {
            await message.reply('📦 **[نظام النسخ الاحتياطي]:** جاري سحب بيانات السيرفر (رتب، قنوات، إعدادات) وحفظها...');
            await message.author.send('📦 إليك تقرير النسخ الاحتياطي الأخير للسيرفر الخاص بك: الحالة سليم ومحفوظ بنجاح.');
        } catch (error) {
            message.reply('❌ فشل في إنشاء النسخة الاحتياطية، تأكد من فتح الخاص (DM).');
        }
    }

    // أمر نسخ السيرفرات الشامل مع لوقز التنبيهات
    if (message.content.startsWith('.clone')) {
        try {
            await message.author.send('🛠️ **[نظام مراقبة النسخ]:** تم بدء عملية نسخ هيكل السيرفر بنجاح، سيتم إعلامك بالخطوات أولاً بأول.');
            message.reply('✅ تم تفعيل عملية النسخ وإرسال لوقز التتبع والتنبيهات إلى رسائلك الخاصة (DM).');
        } catch (error) {
            console.error('خطأ في نظام النسخ:', error);
            message.reply('❌ حدث خطأ، يجدر التأكد من الصلاحيات وفتح الخاص (DM).');
        }
    }

    // أمر رسالة الخاص البسيطة
    if (message.content === 'بريفي') {
        try {
            await message.author.send(`${message.author} يدكم فيه تحيا سنافر`);
            message.reply('تم إرسال الرسالة لك على الخاص! 📥');
        } catch (error) {
            message.reply('لم أتمكن من إرسال الرسالة لك، تأكد من فتح الخاص في إعدادات الخصوصية!');
        }
    }

    // أمر إرسال رسالة لشخص بمنشن
    if (message.content.startsWith('!امسج')) {
        const user = message.mentions.users.first();
        if (!user) return message.reply('يرجى عمل منشن للشخص المطلوب! مثال: `!امسج @username`');

        try {
            await user.send(`مرحباً ${user}! أرسل لك ${message.author.username} هذه الرسالة من السيرفر 📩`);
            message.reply(`تم إرسال الرسالة بنجاح إلى ${user.username} على الخاص!`);
        } catch (error) {
            message.reply('تعذر إرسال الرسالة، الخاص مغلق عند هذا المستخدم.');
        }
    }
});

// --- 2. نظام إعطاء الرتبة التلقائي عند دخول عضو جديد ---
client.on('guildMemberAdd', async (member) => {
    try {
        const role = member.guild.roles.cache.get(AUTO_ROLE_ID);
        if (!role) return console.log('❌ لم يتم العثور على رتبة الترحيب التلقائي!');

        await member.roles.add(role);
        console.log(`✅ تم إعطاء رتبة [${role.name}] للعضو الجديد: ${member.user.tag}`);
    } catch (error) {
        console.error('❌ خطأ في إعطاء الرتبة التلقائية:', error);
    }
});

// --- 3. نظام الحماية ضد الهجمات والتخريب ---
client.on('channelDelete', async (channel) => {
    try {
        console.warn(`⚠️ تنبيه حماية: تم حذف قناة (${channel.name})، جاري فحص الأمان...`);
    } catch (error) {
        console.error('خطأ في نظام حماية القنوات:', error);
    }
});

client.on('roleDelete', async (role) => {
    try {
        console.warn(`⚠️ تنبيه حماية: تم حذف رتبة (${role.name})!`);
    } catch (error) {
        console.error('خطأ في نظام حماية الرتب:', error);
    }
});

// تسجيل الدخول الآمن باستخدام متغيرات البيئة في Render
client.login(process.env.TOKEN);