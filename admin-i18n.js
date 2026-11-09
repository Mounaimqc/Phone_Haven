/**
 * Phone Haven - Admin Internationalization Module (FR / AR)
 * Bilingual support with RTL layout and localStorage persistence
 */

export const translations = {
    fr: {
        // Sidebar & General
        brand_name: "Phone Haven",
        brand_sub: "Terminal Logistique Sétif",
        nav_dashboard: "Tableau de Bord",
        nav_orders: "Commandes",
        nav_products: "Catalogue",
        nav_shipping: "Tarifs Livraison (58)",
        nav_reports: "Rapports",
        admin_user: "Administrateur",
        admin_authorized: "Session Active",
        lock_session: "Déconnexion",

        // Header
        dashboard_title: "Tableau de Bord // Analytique",
        system_online: "Système en Ligne",
        switch_lang_btn: "🇩🇿 العربية",
        refresh_btn_title: "Actualiser les données",

        // KPI Cards
        kpi_inventory: "Articles en Stock",
        kpi_orders: "Total des Commandes",
        kpi_revenue: "Chiffre d'Affaires Brut",
        kpi_avg_order: "Panier Moyen",

        // Charts & Insights
        volume_trajectory: "Évolution des Ventes",
        volume_subtitle: "Analyse des performances et de la croissance sur 6 mois",
        client_segmentation: "Segmentation Clients",
        elite_tier: "Clients VIP (+50 000 DA)",
        recurring_tier: "Clients Fidèles",
        new_tier: "Nouveaux Clients",
        recommendation_title: "Conseils & Recommandations",
        recommendation_text: "Privilégier le réassort des smartphones les plus vendus et fidéliser les clients réguliers avec des offres personnalisées.",

        // Periods
        period_1: "Mois -5",
        period_2: "Mois -4",
        period_3: "Mois -3",
        period_4: "Mois -2",
        period_5: "Mois -1",
        period_current: "En cours",

        // Recent Orders Table
        recent_transmissions: "Commandes Récentes",
        open_ledger: "Toutes les commandes →",
        th_id: "Réf. Commande",
        th_client: "Client & Wilaya",
        th_status: "Statut",
        th_value: "Montant",
        loading_orders: "Chargement des commandes...",
        no_orders: "Aucune commande trouvée",
        currency: "DA",

        // Orders Page Specific
        orders_page_title: "Registre des Commandes",
        orders_page_sub: "Flux de transmission logistique en direct",
        filter_all: "Toutes",
        filter_pending: "En attente",
        filter_confirmed: "Confirmées",
        filter_shipped: "Expédiées",
        filter_delivered: "Livrées",
        filter_cancelled: "Annulées",
        btn_export: "Exporter CSV",
        btn_new_order: "+ Nouvelle Commande",
        search_orders_placeholder: "Rechercher par client, tél, wilaya, ID...",

        // Products Page Specific
        products_page_title: "Catalogue & Inventaire",
        products_page_sub: "Gestion des smartphones et accessoires",
        btn_add_product: "+ Ajouter un Produit",
        search_products_placeholder: "Rechercher un produit...",

        // Statuses
        status_Pending: "En attente",
        status_Confirmed: "Confirmé",
        status_InTransit: "En route",
        status_Shipped: "En route",
        status_OutForDelivery: "En livraison",
        status_Delivered: "Livré",
        status_Cancelled: "Annulé",

        // Order Details Page
        order_details_title: "Détails de la Commande",
        order_details_sub: "Gestion et mise à jour du statut",
        cust_info_title: "Informations du Client",
        cust_name_label: "Nom & Prénom",
        cust_phone_label: "Numéro de Téléphone",
        cust_address_label: "Adresse de Livraison",
        cust_location_label: "Wilaya & Commune",
        cust_shipping_label: "Mode de Livraison",
        shipping_home: "À Domicile",
        shipping_desk: "Point Relais (Stop Desk)",
        order_item_title: "Produit Commandé",
        order_total_label: "Montant Total",
        order_status_title: "Statut de la Commande",
        order_status_label: "Modifier l'état :",
        btn_update_status: "Mettre à jour le Statut",
        btn_whatsapp: "WhatsApp",
        btn_call: "Appeler",
        btn_print: "Imprimer la Facture",
        order_history_note: "Informations & Recommandations",
        order_history_text: "Veillez à contacter le client par WhatsApp ou téléphone pour confirmer la commande avant l'expédition.",
        order_updated_toast: "✓ Statut de la commande mis à jour avec succès !"
    },
    ar: {
        // Sidebar & General
        brand_name: "فون هافن",
        brand_sub: "مركز التحكم اللوجستي - سطيف",
        nav_dashboard: "لوحة التحكم",
        nav_orders: "إدارة الطلبات",
        nav_products: "المخزون والمنتجات",
        nav_shipping: "أسعار التوصيل (58 ولاية)",
        nav_reports: "التقارير والإحصائيات",
        admin_user: "مدير النظام",
        admin_authorized: "جلسة نشطة ومصرحة",
        lock_session: "تسجيل الخروج",

        // Header
        dashboard_title: "لوحة التحكم // التحليلات العامة",
        system_online: "النظام متصل 🟢",
        switch_lang_btn: "🇫🇷 Français",
        refresh_btn_title: "تحديث البيانات",

        // KPI Cards
        kpi_inventory: "المنتجات في المخزن",
        kpi_orders: "إجمالي الطلبات",
        kpi_revenue: "إجمالي الإيرادات",
        kpi_avg_order: "متوسط سلة المشتريات",

        // Charts & Insights
        volume_trajectory: "تطور حجم المبيعات",
        volume_subtitle: "تحليل الأداء ونمو المبيعات على مدار 6 أشهر",
        client_segmentation: "تصنيف العملاء",
        elite_tier: "عملاء النخبة VIP (+50,000 د.ج)",
        recurring_tier: "عملاء دائمون ومكررون",
        new_tier: "عملاء جدد",
        recommendation_title: "توصيات وإرشادات تشغيلية",
        recommendation_text: "إعطاء الأولوية لتوفير الهواتف الأكثر طلباً وتعزيز ولاء الزبائن الدائمين بعروض حصرية.",

        // Periods
        period_1: "قبل 5 أشهر",
        period_2: "قبل 4 أشهر",
        period_3: "قبل 3 أشهر",
        period_4: "قبل شهرين",
        period_5: "الشهر السابق",
        period_current: "الحالي",

        // Recent Orders Table
        recent_transmissions: "أحدث الطلبات المستلمة",
        open_ledger: "عرض كل الطلبات ←",
        th_id: "رقم الطلب",
        th_client: "الزبون والولاية",
        th_status: "حالة الطلب",
        th_value: "المبلغ الإجمالي",
        loading_orders: "جاري تحميل الطلبات...",
        no_orders: "لا توجد طلبات حديثة",
        currency: "د.ج",

        // Orders Page Specific
        orders_page_title: "سجل الطلبات",
        orders_page_sub: "متابعة الطلبات والشحن في الوقت الفعلي",
        filter_all: "الكل",
        filter_pending: "قيد الانتظار",
        filter_confirmed: "مؤكدة",
        filter_shipped: "تم الشحن",
        filter_delivered: "تم التوصيل",
        filter_cancelled: "ملغاة",
        btn_export: "تصدير CSV",
        btn_new_order: "+ طلب جديد",
        search_orders_placeholder: "بحث بالاسم، الهاتف، الولاية، المعرف...",

        // Products Page Specific
        products_page_title: "كتالوج المنتجات والمخزون",
        products_page_sub: "إدارة الهواتف الذكية والإكسسوارات",
        btn_add_product: "+ إضافة منتج جديد",
        search_products_placeholder: "بحث عن منتج...",

        // Statuses
        status_Pending: "قيد الانتظار",
        status_Confirmed: "مؤكدة",
        status_InTransit: "في الطريق",
        status_Shipped: "في الطريق",
        status_OutForDelivery: "جاري التوصيل",
        status_Delivered: "تم التسليم",
        status_Cancelled: "ملغاة",

        // Order Details Page
        order_details_title: "تفاصيل الطلب",
        order_details_sub: "إدارة ومتابعة وتحديث حالة الطلب",
        cust_info_title: "بيانات ومعلومات الزبون",
        cust_name_label: "الاسم الكامل",
        cust_phone_label: "رقم الهاتف",
        cust_address_label: "عنوان التوصيل",
        cust_location_label: "الولاية والبلدية",
        cust_shipping_label: "طريقة التوصيل",
        shipping_home: "توصيل للمنزل",
        shipping_desk: "استلام من المكتب (Stop Desk)",
        order_item_title: "المنتج المطلوب",
        order_total_label: "المبلغ الإجمالي",
        order_status_title: "حالة الطلب الحالية",
        order_status_label: "تعديل حالة الطلب :",
        btn_update_status: "تحديث الحالة",
        btn_whatsapp: "واتساب",
        btn_call: "اتصال",
        btn_print: "طباعة الفاتورة",
        order_history_note: "إرشادات وتنبيهات",
        order_history_text: "يرجى الاتصال بالزبون عبر الهاتف أو واتساب لتأكيد الطلبية قبل شحنها.",
        order_updated_toast: "✓ تم تحديث حالة الطلب بنجاح !"
    }
};

export function getAdminLanguage() {
    return localStorage.getItem('phonehaven_admin_lang') || 'fr';
}

export function setAdminLanguage(lang) {
    if (lang !== 'fr' && lang !== 'ar') lang = 'fr';
    localStorage.setItem('phonehaven_admin_lang', lang);
    applyAdminLanguage(lang);
}

export function t(key, lang = null) {
    const activeLang = lang || getAdminLanguage();
    const dict = translations[activeLang] || translations.fr;
    return dict[key] || translations.fr[key] || key;
}

export function formatPriceI18n(price, lang = null) {
    const activeLang = lang || getAdminLanguage();
    const formatted = new Intl.NumberFormat(activeLang === 'ar' ? 'ar-DZ' : 'fr-DZ').format(price || 0);
    return `${formatted} ${t('currency', activeLang)}`;
}

export function getStatusLabelI18n(status, lang = null) {
    const activeLang = lang || getAdminLanguage();
    return t(`status_${status}`, activeLang) || status;
}

export function applyAdminLanguage(lang = null) {
    const activeLang = lang || getAdminLanguage();
    const isAr = activeLang === 'ar';

    // Update document attributes
    document.documentElement.lang = activeLang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';

    if (isAr) {
        document.body.classList.add('font-arabic');
    } else {
        document.body.classList.remove('font-arabic');
    }

    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            const translated = t(key, activeLang);
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translated;
            } else {
                el.textContent = translated;
            }
        }
    });

    // Translate all elements with data-i18n-title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) el.title = t(key, activeLang);
    });

    // Update language switcher buttons
    const langBtn = document.getElementById('admin-lang-toggle');
    if (langBtn) {
        langBtn.innerHTML = `
            <span class="text-sm">${isAr ? '🇫🇷' : '🇩🇿'}</span>
            <span class="text-xs font-bold">${isAr ? 'Français' : 'العربية'}</span>
        `;
    }

    // Trigger custom event so page can re-render dynamic content (e.g. tables)
    window.dispatchEvent(new CustomEvent('adminLanguageChanged', { detail: { lang: activeLang } }));
}

export function initAdminLanguage() {
    const currentLang = getAdminLanguage();
    applyAdminLanguage(currentLang);

    const langBtn = document.getElementById('admin-lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const newLang = getAdminLanguage() === 'fr' ? 'ar' : 'fr';
            setAdminLanguage(newLang);
        });
    }
}
