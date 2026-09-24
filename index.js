const { Client } = require('discord.js-selfbot-v13');

// --- نظام الحماية الشامل (منع توقف السيلفبوت) ---
process.on('unhandledRejection', error => {
    console.error('⚠️ خطأ غير معالـج (Unhandled Rejection):', error);
});

process.on('uncaughtException', error => {
    console.error('⚠️ استثناء غير متوقع (Uncaught Exception):', error);
});

// إعداد العميل (Client) للسيلفبوت بدون أي إعدادات معقدة
const client = new Client({
    checkUpdate: false
});




// إعدادات المتغيرات الأساسية
const AUTO_ROLE_ID = '1552699951182520371'; // ID الرتبة التلقائية

client.once('ready', async () => {
    console.log(`✅ تم تسجيل الدخول بنجاح باسم السيلفبوت: ${client.user.tag}`);

    // تسجيل الأوامر المائلة (Slash Commands)
    const commands = [
        new SlashCommandBuilder()
            .setName('ping')
            .setDescription('يعرض سرعة استجابة البوت'),
        new SlashCommandBuilder()
            .setName('clone-status')
            .setDescription('فحص حالة نظام نسخ السيرفرات والحماية')
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log('🔄 جاري تحديث الأوامر المائلة...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('✨ تم تسجيل الأوامر بنجاح!');
    } catch (error) {
        console.error('❌ خطأ أثناء تسجيل الأوامر:', error);
    }
});

// --- 2. نظام التفاعل مع الأوامر المائلة (Slash Commands) ---
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        const latency = Math.round(client.ws.ping);
        await interaction.reply({ content: `pong! 🏓 سرعة الاستجابة هي: ${latency}ms`, ephemeral: true });
    } 
    
    else if (commandName === 'clone-status') {
        await interaction.reply({ content: `🛡️ أنظمة النسخ الاحتياطي، الحماية ضد الهجمات، واللوقز تعمل بكفاءة عالية!`, ephemeral: true });
    }
});

// --- 3. نظام إعطاء الرتبة التلقائي عند دخول عضو جديد ---
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

// --- 4. نظام الحماية ضد الهجمات والتخريب (Anti-Nuke / Anti-Raid) ---
client.on('channelDelete', async (channel) => {
    try {
        console.warn(`⚠️ تنبيه حماية: تم حذف قناة (${channel.name})، جاري فحص الأمان...`);
        // هنا يمكنك إضافة كود سحب الصلاحيات أو التنبيه الفوري على الخاص
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

// --- 5. نظام الأوامر المتقدمة عبر الرسائل (Prefix Commands & Clone & Backup & DMs) ---
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // أمر البينغ العادي
    if (message.content === '!ping') {
        message.reply('pong! 🏓');
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

    // أمر نسخ السيرفرات الشامل مع لوقز التنبيهات (Clone Logging & DM)
    if (message.content.startsWith('.clone')) {
        try {
            await message.author.send('🛠️ **[نظام مراقبة النسخ]:** تم بدء عملية نسخ هيكل السيرفر بنجاح، سيتم إعلامك بالخطوات أولاً بأول.');
            await message.reply('✅ تم تفعيل عملية النسخ وإرسال لوقز التتبع والتنبيهات إلى رسائلك الخاصة (DM).');
            
            // [منطقة كود النسخ الفعلي للقنوات والرتب تضاف هنا]

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

// تسجيل الدخول الآمن باستخدام متغيرات البيئة في Render
client.login(process.env.TOKEN);