function Hayford_Iagrs($pa_longitude, $pa_latitude)
<!-- De PRIAM (ED50) - Hayford 1909 (3) -- VERS -- GPS (WGS84) Sexa - Iagrs80--RGF93 mais WGS84 tout de même avec les constantes (2) -->
    {
    <!-- Constantes Ellipsoïde Hayford PRIAM ED50 -->
    var Hayford_a = 6378388.00;
    var Hayford_f = 297;
    var Hayford_b = Hayford_a - (Hayford_a / Hayford_f);

    // la valeur e est en fait e au carré

    var Hayford_e = ((Math.pow(Hayford_a,2) - Math.pow(Hayford_b,2)) / Math.pow(Hayford_a,2));

    <!-- Constantes Ellipsoïde Iagrs reporté GPS WGS84 -->
    var Iagrs_a = 6378137;
    var Iagrs_f = 298.257223563;
    var Iagrs_b = Iagrs_a - (Iagrs_a / Iagrs_f);

    // la valeur e est en fait e au carré

    var Iagrs_e = (Math.pow(Iagrs_a,2) - Math.pow(Iagrs_b,2)) / Math.pow(Iagrs_a,2);

    <!-- Constantes Tx, Ty, Tz en mètres de Transformation de 3 vers 2 -->
    var Tx = -84;
    var Ty = -97;
    var Tz = -117;

    <!-- Coordonnées LONGITUDE Priam Saisies (Si W -> -1 ou Si E -> 1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) -->

    <!-- Mise en Float des variables lues pour éviter les erreurs NaN (Not a Number) -->
    var Pri_Long_Sgn = parseFloat($pa_longitude[0]);
    var Pri_Long_Deg = parseFloat($pa_longitude[1]);
    var Pri_Long_Min = parseFloat($pa_longitude[2]);
    var Pri_Long_Sec = parseFloat($pa_longitude[3]);

    <!-- Coordonnées LONGITUDE Priam (Lambda) Décimale calculée -->
    var Pri_Long_Dec = Pri_Long_Sgn * ((Pri_Long_Deg) + (Pri_Long_Min / 60) + (Pri_Long_Sec / 3600));

    <!-- Coordonnées LATITUDE Priam Saisies (Si N -> 1 ou Si S -> -1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) -->

    <!-- Mise en Float les variables lues pour éviter les erreurs NaN (Not a Number) -->
    var Pri_Lat_Sgn = parseFloat($pa_latitude[0]);
    var Pri_Lat_Deg = parseFloat($pa_latitude[1]);
    var Pri_Lat_Min = parseFloat($pa_latitude[2]);
    var Pri_Lat_Sec = parseFloat($pa_latitude[3]);

    <!-- Coordonnées LATITUDE Priam (Phi) Décimale calculée -->
    var Pri_Lat_Dec = Pri_Lat_Sgn * ((Pri_Lat_Deg) + (Pri_Lat_Min / 60) + (Pri_Lat_Sec / 3600));

    <!-- Pas de considération de hauteur (en mètres) mis à 0 -- Peut être perfectible en ajoutant les tables de hauteur -->
    var Hauteur = 0;

    <!-- Référence Méridien de Grennwich pas décalage d'un système à l'autre -->

     <!-- Partie - coordonnées géocentriques sur l'ellipsoïde 'H' Origine (Hayford 1909 - ED50 Priam)
    <!-- Variable v (en mètres) calculée par la fct Hayford_a / Racine(1-(Hayford_e*sin(Pri_Lat_Dec*(Pi/180)))^2) -->
    var H_v = Hayford_a / (Math.sqrt(1 - (Hayford_e * Math.pow(Math.sin(Pri_Lat_Dec * (Math.PI / 180)),2))));

    <!-- Variable X calculée en mètres X = (v+h).Cos(Phi).Cos(Lambda) (H_X comme Hayford Z) -->
    var H_X = (H_v + Hauteur) * Math.cos(Pri_Lat_Dec * (Math.PI / 180)) * Math.cos(Pri_Long_Dec * (Math.PI / 180));

    <!-- Variable Y calculée en mètres Y = (v+h).Cos(Phi).Sin(Lambda) (H_Y comme Hayford Z) -->
    var H_Y = (H_v + Hauteur) * Math.cos(Pri_Lat_Dec * (Math.PI / 180)) * Math.sin(Pri_Long_Dec * (Math.PI / 180));

    <!-- Variable Z calculée en mètres Z = (v*(1-e)+h).Sin(Phi) (H_Z comme Hayford Z) -->
    var H_Z = (H_v * (1 - Hayford_e) + Hauteur) * Math.sin(Pri_Lat_Dec * (Math.PI / 180));

     <!-- Partie - coordonnées géocentriques sur l'ellipsoïde 'I' Destination (Iagrs80 - WGS84 GPS) -->
    <!-- Décalage longitude Paris Greenwich (2° 20' 14.025"") - Valeur en Degrés décimaux -->
    var Paris_Green = 2 + (20 / 60) + (14.025 / 3600);
    <!-- Dans ce cas aucune différence - même référence = Greenwich nommé Lambda_0 -->
    var Lambda_0 = 0;

    <!-- Variable I_X calculée en mètres X'= Tx + X * Cos(Lambda_0) + Y * Sin(Lambda_0) (I_X comme Iagrs X) -->
    var I_X = Tx + H_X * Math.cos(Lambda_0 * (Math.PI / 180)) + H_Y * Math.sin(Lambda_0 * (Math.PI / 180));

    <!-- Variable I_Y calculée en mètres Y'= Ty - X * Sin(Lambda_0) + Y * Cos(Lambda_0) (I_Y comme Iagrs Y) -->
    var I_Y = Ty - H_X * Math.sin(Lambda_0 * (Math.PI / 180)) + H_Y * Math.cos(Lambda_0 * (Math.PI / 180));

    <!-- Variable I_Z calculée en mètres Z'= Z + Tz (I_Z comme Iagrs Z) -->
    var I_Z = H_Z + Tz;

    <!-- Variable Re_1 calculée en mètres Re_1 = RACINE (X'^2 + Y'^2) Re_1 Car autre formule de calcul donne meme résultat -->
    var Re_1 = Math.sqrt(Math.pow(I_X,2) + (Math.pow(I_Y,2)));

     <!-- Partie Coordonnées géographiques sur l'ellipsoïde 'I' de destination - Iagrs80 - Origine Greenwich -->
    <!-- Longitude Lambda en degrés décimaux sur Iagrs - Long_I_Dec = Atan(Y'/X')/(Pi/180) -->
    var Long_I_Dec = Math.atan(I_Y / I_X) / (Math.PI / 180);

    <!-- Latitude Phi en degrés décimaux sur Iagrs - Lat_I_Dec = difficile à énoncer calcul récurcif -->
    var ecart = 1;
    var Phi = Pri_Lat_Dec / (180 * Math.PI);
    while (ecart > 0.0000000001)
        {
        Phi_1 = Math.atan((I_Z + Iagrs_e * Math.sin(Phi) * Iagrs_a / Math.sqrt(1 - Iagrs_e * Math.pow(Math.sin(Phi),2))) / Re_1);
        ecart = Math.abs(Phi - Phi_1);
        Phi = Phi_1;
        }
    var Lat_I_Dec = Phi * (180 / Math.PI);

    <!-- Variable v en mètre sur Geoïde de destination - I_v = Iagrs_a / (racine (1 - Iagrs_e * (sin(Phi * 180/PI)^2) -->
    var I_v = Iagrs_a / (Math.sqrt(1 - (Iagrs_e * Math.pow(Math.sin(Lat_I_Dec * (Math.PI / 180)),2))));

    <!-- Hauteur ellipsoïdale h_I en mètres - Résultat à corriger pour passer à des altitudes NGF au dessus de l'éllipsoïde -->
    <!-- Formule = h_I = Re / Cos(Phi) - v -->
    var h_I = Re_1 / Math.cos(Lat_I_Dec*(Math.PI / 180)) - I_v;

    return new Array(Long_I_Dec,Lat_I_Dec);


<!-- Fin de la fonction De PRIAM (ED50) - Hayford 1909 (3) -- VERS -- GPS (WGS84) Sexa - Iagrs80 (2) -->
    }

function NTF_ED50($pa_longitude, $pa_latitude)
<!-- De GeoConcept (NTF) Sexa - Clarke 1880 (1) -- VERS --  PRIAM (ED50) - Hayford 1909 (3) -->
    {
    <!-- Constantes Ellipsoïde Hayford PRIAM ED50 -->
    var Hayford_a = 6378388.00;
    var Hayford_f = 297;
    var Hayford_b = Hayford_a - (Hayford_a / Hayford_f);
    var Hayford_e = (Math.pow(Hayford_a,2) - Math.pow(Hayford_b,2)) / Math.pow(Hayford_a,2);

    <!-- Constantes Ellipsoïde Clarke GeoConcept NTF -->
    var Clarke_a = 6378249.2;
    var Clarke_b = 6356515;
    var Clarke_f = 1 / ((Clarke_a - Clarke_b) / Clarke_a);
    var Clarke_e = (Math.pow(Clarke_a,2) - Math.pow(Clarke_b,2)) / Math.pow(Clarke_a,2);

    <!-- Constantes Tx, Ty, Tz en mètres de Transformation de 1 vers 3 -->
    var Tx = -84;
    var Ty = 37;
    var Tz = 437;

    <!-- Coordonnées LONGITUDE NTF Saisies (Si W -> -1 ou Si E -> 1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) -->

    <!-- Mise en Float des variables lues pour éviter les erreurs NaN (Not a Number) -->
    var NTF_Long_Sgn = parseFloat($pa_longitude[0]);
    var NTF_Long_Deg = parseFloat($pa_longitude[1]);
    var NTF_Long_Min = parseFloat($pa_longitude[2]);
    var NTF_Long_Sec = parseFloat($pa_longitude[3]);

    <!-- Coordonnées LONGITUDE NTF (Lambda) Décimale calculée -->
    var NTF_Long_Dec = NTF_Long_Sgn * ((NTF_Long_Deg) + (NTF_Long_Min / 60) + (NTF_Long_Sec / 3600));

    <!-- Coordonnées LATITUDE NTF Saisies (Si N -> 1 ou Si S -> -1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) -->

    <!-- Mise en Float les variables lues pour éviter les erreurs NaN (Not a Number) -->
    var NTF_Lat_Sgn = parseFloat($pa_latitude[0]);
    var NTF_Lat_Deg = parseFloat($pa_latitude[1]);
    var NTF_Lat_Min = parseFloat($pa_latitude[2]);
    var NTF_Lat_Sec = parseFloat($pa_latitude[3]);

    <!-- Coordonnées LATITUDE NTF (Phi) Décimale calculée -->
    var NTF_Lat_Dec = NTF_Lat_Sgn * ((NTF_Lat_Deg) + (NTF_Lat_Min / 60) + (NTF_Lat_Sec / 3600));

    <!-- Pas de considération de hauteur (en mètres) mis à 0 -- Peut être perfectible en ajoutant les tables de hauteur -->
    var Hauteur = 0;

    <!-- Référence Méridien de Grennwich pas décalage d'un système à l'autre -->

     <!-- Partie - coordonnées géocentriques sur l'ellipsoïde 'NTF' Origine (Clarke 1880 - NTF)
    <!-- Variable v (en mètres) calculée par la fct Hayford_a / Racine(1-(Hayford_e*sin(Pri_Lat_Dec*(Pi/180)))^2) -->
    var NTF_v = Clarke_a / (Math.sqrt(1 - (Clarke_e * Math.pow(Math.sin(NTF_Lat_Dec * (Math.PI / 180)),2))))

    <!-- Variable X calculée en mètres X = (v+h).Cos(Phi).Cos(Lambda) -->
    var NTF_X = (NTF_v + Hauteur) * Math.cos(NTF_Lat_Dec * (Math.PI / 180)) * Math.cos(NTF_Long_Dec * (Math.PI / 180));

    <!-- Variable Y calculée en mètres Y = (v+h).Cos(Phi).Sin(Lambda) -->
    var NTF_Y = (NTF_v + Hauteur) * Math.cos(NTF_Lat_Dec * (Math.PI / 180)) * Math.sin(NTF_Long_Dec * (Math.PI / 180));

    <!-- Variable Z calculée en mètres Z = (v*(1-e)+h).Sin(Phi) -->
    var NTF_Z = (NTF_v * (1 - Clarke_e) + Hauteur) * Math.sin(NTF_Lat_Dec * (Math.PI / 180));

     <!-- Partie - coordonnées géocentriques sur l'ellipsoïde 'ED50' Destination ( Hayford 1909 - ED50 Priam) -->
    <!-- Décalage longitude Paris Greenwich (2° 20' 14.025"") - Valeur en Degrés décimaux -->
    var Paris_Green = 2 + (20 / 60) + (14.025 / 3600);
    <!-- Dans ce cas aucune différence - même référence = Greenwich nommé Lambda_0 -->
    var Lambda_0 = 0;

    <!-- Variable X calculée en mètres X'= Tx + X * Cos(Lambda_0) + Y * Sin(Lambda_0) -->
    var ED50_X = Tx + NTF_X * Math.cos(Lambda_0 * (Math.PI / 180)) + NTF_Y * Math.sin(Lambda_0 * (Math.PI / 180));

    <!-- Variable Y calculée en mètres Y'= Ty - X * Sin(Lambda_0) + Y * Cos(Lambda_0) -->
    var ED50_Y = Ty - NTF_X * Math.sin(Lambda_0 * (Math.PI / 180)) + NTF_Y * Math.cos(Lambda_0 * (Math.PI / 180));

    <!-- Variable Z calculée en mètres Z'= Z + Tz -->
    var ED50_Z = NTF_Z + Tz;

    <!-- Variable Re_1 calculée en mètres Re_1 = RACINE (X'^2 + Y'^2) Re_1 Car autre formule de calcul donne meme résultat -->
    var Re_1 = Math.sqrt(Math.pow(ED50_X,2) + (Math.pow(ED50_Y,2)));

     <!-- Partie Coordonnées géographiques sur l'ellipsoïde de destination - Hayford 1909 - Origine Greenwich -->
    <!-- Longitude Lambda en degrés décimaux sur Hayford -->
    var Long_ED50_Dec = Math.atan(ED50_Y / ED50_X) / (Math.PI / 180);

    <!-- Latitude Phi en degrés décimaux sur Hayford - Lat_ED50_Dec = difficile à énoncer calcul récurcif -->
    var ecart = 1;
    var Phi = NTF_Lat_Dec / (180 * Math.PI);
    while (ecart > 0.0000000001)
        {
        Phi_1 = Math.atan((ED50_Z + Hayford_e * Math.sin(Phi) * Hayford_a / Math.sqrt(1 - Hayford_e * Math.pow(Math.sin(Phi),2))) / Re_1);
        ecart = Math.abs(Phi - Phi_1);
        Phi = Phi_1;
        }
    var Lat_ED50_Dec = Phi * (180 / Math.PI);

    <!-- Variable v en mètre sur Geoïde de destination - ED50_v -->
    var ED50_v = Hayford_a / (Math.sqrt(1 - (Hayford_e * Math.pow(Math.sin(Lat_ED50_Dec * (Math.PI / 180)),2))));

    <!-- Hauteur ellipsoïdale h_ED50 en mètres - Résultat à corriger pour passer à des altitudes NGF au dessus de l'éllipsoïde -->
    var h_ED50 = Re_1 / Math.cos(Lat_ED50_Dec*(Math.PI / 180)) - ED50_v;

     <!-- Tranformation Degrés décimaux Longitude arrivée en degré minute seconde avec reconnaissance E W -->
    if (Long_ED50_Dec > 0)
        {
        var E_W_Long_ED50 = 1;
        }
    else
        {
        var E_W_Long_ED50 = -1;
        }
    var Long_ED50_Dec = Math.abs(Long_ED50_Dec);
    var Deg_Long_ED50 = Math.abs(Math.floor(Long_ED50_Dec));
    var Min_Long_ED50 = Math.floor((Long_ED50_Dec - Deg_Long_ED50) * 60);
    var Sec_Long_ED50 = Math.round(((Long_ED50_Dec - Deg_Long_ED50 - Min_Long_ED50 / 60) * 3600)*1000)/1000;

     <!-- Tranformation Degrés décimaux Latitude arrivée en degré minute seconde avec reconnaissance N S -->
    if (Lat_ED50_Dec > 0)
        {
        var N_S_Lat_ED50 = 1;
        }
    else
        {
        var N_S_Lat_ED50 = -1;
        }
    var Lat_ED50_Dec = Math.abs(Lat_ED50_Dec);
    var Deg_Lat_ED50 = Math.floor(Lat_ED50_Dec);
    var Min_Lat_ED50 = Math.floor((Lat_ED50_Dec - Deg_Lat_ED50) * 60);
    var Sec_Lat_ED50 = Math.round(((Lat_ED50_Dec - Deg_Lat_ED50 - Min_Lat_ED50 / 60) * 3600)*1000)/1000;

    var la_result = Hayford_Iagrs(new Array(E_W_Long_ED50, Deg_Long_ED50, Min_Long_ED50, Sec_Long_ED50), new Array(N_S_Lat_ED50, Deg_Lat_ED50, Min_Lat_ED50, Sec_Lat_ED50));
    return la_result;

<!-- Fin de la fonction NTF_ED50 - GeoConcept (NTF) Sexa - Clarke 1880 (1) -- VERS -- PRIAM (ED50) - Hayford 1909 (3) -->
    }

function Lamb_WGS84(pi_x, pi_y)
<!-- De Lambert II étendu (NTF) métrique - Clarke 1880 (1) -- VERS -- (NTF) - Clarke 1880 (1) -->
    {
    <!-- Début des calculs sur une base de Lambert II ---- Voir si portable en Etendu -->
    <!-- Mise en Float les variables lues pour éviter les erreurs NaN (Not a Number) -->
    var Lamb_EE = pi_x;
    var Lamb_NN = pi_y;

    <!-- Recherche de la zone Lambert du point - Inutilisé pour l'instant - Seul Lambert II-->
    var Lamb_Zone = Math.floor(Lamb_NN / 1000000);

    <!-- Constante pour la Zone II Lambert -->
    <!-- Calcul des constantes sur le goide Clarke 1880 pour Lambert II -->
    var Lamb_a = 6378249.2;
    var Lamb_f = 293.466021300;
    var Lamb_b = Lamb_a * (1 - 1 / Lamb_f);
    var Lamb_e = Math.sqrt((Math.pow(Lamb_a,2) - Math.pow(Lamb_b,2)) / Math.pow(Lamb_a,2));
    var Lamb_Phi1 = 50.99879884 / 200 * 180;
    var Lamb_Phi2 = 52.99557167 / 200 * 180;
    var Lamb_vo1 = Lamb_a / Math.sqrt(1 - Math.pow(Lamb_e,2) * (Math.pow(Math.sin(Lamb_Phi1 * Math.PI / 180),2)));
    var Lamb_vo2 = Lamb_a / Math.sqrt(1 - Math.pow(Lamb_e,2) * (Math.pow(Math.sin(Lamb_Phi2 * Math.PI / 180),2)));
    <!-- Phi0 est la Latitude du parallèle d origine -->
    var Lamb_Phi0 = 52 * 0.9;
    var Lamb_po1 = Lamb_a * (1 - Math.pow(Lamb_e,2)) / Math.pow((Math.sqrt(1 - Math.pow(Lamb_e,2) * Math.pow((Math.sin(Lamb_Phi1 * Math.PI / 180)),2))),3);
    var Lamb_po2 = Lamb_a * (1 - Math.pow(Lamb_e,2)) / Math.pow((Math.sqrt(1 - Math.pow(Lamb_e,2) * Math.pow((Math.sin(Lamb_Phi2 * Math.PI / 180)),2))),3);
    var Lamb_m1 = 1 + Lamb_po1 / 2 / Lamb_vo1 * Math.pow(((Lamb_Phi1 - Lamb_Phi0) * Math.PI / 180),2);
    var Lamb_m2 = 1 + Lamb_po2 / 2 / Lamb_vo2 * Math.pow(((Lamb_Phi2 - Lamb_Phi0) * Math.PI / 180),2);
    var Lamb_m = (Lamb_m1 + Lamb_m2) / 2;
    var Lamb_CE = 600;
    var Lamb_CN = 2200;
    var Lamb_mL = 2 - Lamb_m;
    var Lamb_v0 = Lamb_a / Math.sqrt(1 - Math.pow(Lamb_e,2) * (Math.pow(Math.sin(Lamb_Phi0 * Math.PI / 180),2)));
    var Lamb_R0 = Lamb_v0 / Math.tan(Lamb_Phi0 * Math.PI / 180);
    <!-- mLR0 est le Rayon du parallèle d origine après réduction d echelle -->
    var Lamb_mLR0 = Lamb_mL * Lamb_R0;
    var Lamb_Ls = Math.log(Math.tan(Math.PI / 4 + Lamb_Phi0 / 2 * Math.PI / 180)) - Lamb_e / 2 * Math.log((1 + Lamb_e * Math.sin(Lamb_Phi0 * Math.PI / 180 )) / (1 - Lamb_e * Math.sin(Lamb_Phi0 * Math.PI / 180)));

    <!-- Abscisse en m dans le repère associé aux méridien et parallèle d'origine -->
    var Lamb_E1 = Lamb_EE - Lamb_CE * 1000;
    <!-- Ordonnée en m dans le repère associé aux méridien et parallèle d'origine -->
    var Lamb_N1 = Lamb_NN - Lamb_CN * 1000;
    <!-- Convergence des méridiens en degrés -->
    Lamb_gamma = Math.atan(Lamb_E1 / (Lamb_mLR0 - Lamb_N1)) * 180 / Math.PI;
    <!-- Lambda0 est la Longitude du méridien de Paris en degré -->
    var Lamb_Lambda0 = 2.596921296 / 200 * 180;
    <!-- Longitude du point recherché en degré par rapport à Greenwich -->
    var NTF_Lambda = (Lamb_gamma / Math.sin(Lamb_Phi0 * Math.PI / 180) + Lamb_Lambda0);

    <!-- Rayon du parallèle passant par le point recherché - en mètres -->
    var Lamb_R = (Lamb_mLR0 - Lamb_N1) / Math.cos(Lamb_gamma * Math.PI / 180);
    <!-- Valeur de L0 pour Phi0 -->
    var Lamb_L0 = Math.log(Math.tan(Math.PI / 4 + Lamb_Phi0 * Math.PI / 360)) - (Lamb_e / 2) * Math.log((1 + Lamb_e * Math.sin(Lamb_Phi0 * Math.PI / 180)) / (1 - Lamb_e * Math.sin(Lamb_Phi0 * Math.PI / 180)));
    <!-- Latitude isométrique L en fonction  de Phi -->
    var Lamb_L = Lamb_L0 + Math.log(Lamb_mLR0 / Lamb_R) / Math.sin(Lamb_Phi0 * Math.PI / 180);
    <!-- Latitude du point recherché -->
    <!-- Latitude Phi en degrés décimaux -->
    var ecart = 1;
    var Phi = 2 * Math.atan(Math.exp(Lamb_L)) - Math.PI / 2;
    while (ecart > 0.000000000001)
        {
        Phi_1 = 2 * (Math.atan(Math.exp(Lamb_L + Lamb_e / 2 * Math.log((1 + Lamb_e * Math.sin(Phi)) / (1 - Lamb_e * Math.sin(Phi)))))) - Math.PI / 2;
        ecart = Math.abs(Phi_1 - Phi);
        Phi = Phi_1;
        }
    var NTF_Phi = Phi * 180 / Math.PI;

    <!-- Module de correction à la projection du point donné -->
    <!-- Rayon de courbure de l ellipse normale principale -->
    var Lamb_v = Lamb_a / Math.sqrt(1 - Math.pow(Lamb_e,2) * (Math.pow(Math.sin(NTF_Phi * Math.PI / 180),2)));
    <!-- Module de réduction à la projection -->
    var Lamb_mr = Lamb_R * Math.sin(Lamb_Phi0 * Math.PI / 180) / Lamb_v / Math.cos(NTF_Phi * Math.PI / 180);
    <!-- Coefficient d altération linéaire en centimètres par kilomètres -->
    var Lamb_kr = (Lamb_mr - 1) * 100000;

    <!-- Mise en forme des latitude Longitude en DMS -->
    <!-- Tranformation Degrés décimaux Longitude arrivée en degré minute seconde avec reconnaissance E W -->
    if (NTF_Lambda > 0)
        {
        var E_W_Long_NTF = 1;
        }
    else
        {
        var E_W_Long_NTF = -1;
        }
    var NTF_Lambda = Math.abs(NTF_Lambda);
    var Deg_Long_NTF = Math.abs(Math.floor(NTF_Lambda));
    var Min_Long_NTF = Math.floor((NTF_Lambda - Deg_Long_NTF) * 60);
    var Sec_Long_NTF = Math.round(((NTF_Lambda - Deg_Long_NTF - Min_Long_NTF / 60) * 3600)*1000)/1000;

     <!-- Tranformation Degrés décimaux Latitude arrivée en degré minute seconde avec reconnaissance N S -->
    if (NTF_Phi > 0)
        {
        var N_S_Lat_NTF = 1;
        }
    else
        {
        var N_S_Lat_NTF = -1;
        }
    var NTF_Phi = Math.abs(NTF_Phi);
    var Deg_Lat_NTF = Math.floor(NTF_Phi);
    var Min_Lat_NTF = Math.floor((NTF_Phi - Deg_Lat_NTF) * 60);
    var Sec_Lat_NTF = Math.round(((NTF_Phi - Deg_Lat_NTF - Min_Lat_NTF / 60) * 3600)*1000)/1000;
    var $la_longitude = new Array(E_W_Long_NTF, Deg_Long_NTF, Min_Long_NTF, Sec_Long_NTF);
    var $la_latitude = new Array(N_S_Lat_NTF, Deg_Lat_NTF, Min_Lat_NTF, Sec_Lat_NTF);

    var la_result = NTF_ED50($la_longitude, $la_latitude);
    return la_result;


<!-- Fin de la fonction Lambert II étendu (NTF) métrique - Clarke 1880 (1) -- VERS -- (NTF) - Clarke 1880 (1) -->
<!-- Module perfectible en ajoutant des boutons radio désignant les zones et en fonction des zones faire les constantes -->
    }

function NTF_Lambert(p_Long_Deg,p_Long_Min,p_Long_Sec,p_Lat_Deg,p_Lat_Min,p_Lat_Sec,p_Long_sgn,p_Lat_sgn)
<!-- Fonction de conversion des valeurs sexagésimales NTF (géoconcept) en coordonnées Lambert II étendu -->
    {
    <!-- Constantes Ellipsoïde Hayford 1909 -->
    <!-- 1/2 grand axe de l ellipsoide en m -->
    var Lamb_a = 6378249.2;
    <!-- 1/2 petit axe de l ellipsoide en m -->
    var Lamb_b = 6356515;
    <!-- Latitude Parallèle d origine en degrés -->
    var Lamb_Phi0 = 46.800;
    <!-- Longitude du méridien de Paris en degrés -->
    var Lamb_Lambda0 = 2.596921296 / 200 * 180;
    <!-- Excentricité de l ellipsoide -->
    var Lamb_e = (Math.sqrt(Math.pow(Lamb_a,2) - Math.pow(Lamb_b,2))) / Lamb_a;

    <!-- Recueil des longitude et latitude -->
    <!-- Coordonnées LONGITUDE Geoconcept NTF (Si W -> -1 ou Si E -> 1) NTF_Deg, NTF_Min, NTF_Sec (virgules autorisées) -->

    <!-- Mise en Float les variables lues pour éviter les erreurs NaN (Not a Number) -->
    var NTF_Long_Sgn = parseFloat(p_Long_sgn);
    var NTF_Long_Deg = parseFloat(p_Long_Deg);
    var NTF_Long_Min = parseFloat(p_Long_Min);
    var NTF_Long_Sec = parseFloat(p_Long_Sec);

    <!-- Coordonnées LONGITUDE NTF (Lambda) Décimale calculée -->
    var NTF_Long_Dec = NTF_Long_Sgn * ((NTF_Long_Deg) + (NTF_Long_Min / 60) + (NTF_Long_Sec / 3600));

    <!-- Coordonnées LATITUDE Geoconcept NTF (Si N -> 1 ou Si S -> -1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) -->

    <!-- Mise en Float des variables lues pour éviter les erreurs NaN (Not a Number) -->
    var NTF_Lat_Sgn = parseFloat(p_Lat_sgn);
    var NTF_Lat_Deg = parseFloat(p_Lat_Deg);
    var NTF_Lat_Min = parseFloat(p_Lat_Min);
    var NTF_Lat_Sec = parseFloat(p_Lat_Sec);

    <!-- Coordonnée LATITUDE NTF (Phi) Décimale calculée -->
    var NTF_Lat_Dec = NTF_Lat_Sgn * ((NTF_Lat_Deg) + (NTF_Lat_Min / 60) + (NTF_Lat_Sec / 3600));
    <!-- Fin du Recueil des longitude et latitude -->

    <!-- Variable Lamb_v en mètres - Rayon de courbure de l 'ellipse normale principale - Lamb_v = Lamb_a / (racine (1 - Lamb_e^2 * (sin(Phi * PI/180)^2)) -->
    var Lamb_v = Lamb_a / (Math.sqrt(1 - Math.pow (Lamb_e,2) * Math.pow(Math.sin (NTF_Lat_Dec * Math.PI / 180),2)));

    <!-- Latitude isométrique - Lamb_LatIso = Ln(tan(Pi/4+Phi/2))-e/2*Ln((1+e*sin(Phi))/(1-e*sin(Phi))) -->
    var Lamb_LatIso = (Math.log(Math.tan((Math.PI / 4 + (NTF_Lat_Dec * Math.PI / 360))))) - Lamb_e / 2 * (Math.log((1 + Lamb_e * Math.sin(NTF_Lat_Dec * Math.PI /180))/(1-Lamb_e*Math.sin(NTF_Lat_Dec * Math.PI /180))));

    <!-- Latitude isométrique pour Lambda0 - Lamb_LatIso0 = Ln(tan(Pi/4+Phi0/2))-e/2*Ln((1+e*sin(Phi0))/(1-e*sin(Phi0))) -->
    var Lamb_LatIso0 = (Math.log(Math.tan((Math.PI / 4 + (Lamb_Phi0 * Math.PI / 360))))) - Lamb_e / 2 * (Math.log((1 + Lamb_e * Math.sin(Lamb_Phi0 * Math.PI /180))/(1-Lamb_e*Math.sin(Lamb_Phi0 * Math.PI /180))));

    <!-- Convergence des méridiens Lamb_Gamma -->
    if(NTF_Long_Dec < 180)
        {
        var Lamb_Gamma = (NTF_Long_Dec - Lamb_Lambda0) * Math.sin(Lamb_Phi0 * Math.PI / 180);
        }
    if(NTF_Long_Dec > 180)
        {
        var Lamb_Gamma = (NTF_Long_Dec - Lamb_Lambda0 - 360) * Math.sin(Lamb_Phi0 * Math.PI / 180);
        }

    <!-- Constantes de Zone Lambert II en Km -->
    var Lamb_Ce = 600;
    var Lamb_Cn = 2200;

    <!-- Calcul des constantes pour la zone II de Lambert -->
    var Lamb_v0 = Lamb_a / (Math.sqrt(1 - Math.pow (Lamb_e,2) * Math.pow(Math.sin (Lamb_Phi0 * Math.PI / 180),2)));
    var Lamb_R0 = Lamb_v0 / Math.tan(Lamb_Phi0 * Math.PI / 180);

    var Lamb_Phi1 = 50.99879884 / 200 * 180;
    var Lamb_Phi2 = 52.99557167 / 200 * 180;

    var Lamb_v01 = Lamb_a / (Math.sqrt(1 - Math.pow (Lamb_e,2) * Math.pow(Math.sin (Lamb_Phi1 * Math.PI / 180),2)));
    var Lamb_v02 = Lamb_a / (Math.sqrt(1 - Math.pow (Lamb_e,2) * Math.pow(Math.sin (Lamb_Phi2 * Math.PI / 180),2)));
    var Lamb_Ro01 = Lamb_a * (1 - Math.pow (Lamb_e,2)) / Math.pow((Math.sqrt(1 - Math.pow (Lamb_e,2) * Math.pow(Math.sin (Lamb_Phi1 * Math.PI / 180),2))),3);
    var Lamb_Ro02 = Lamb_a * (1 - Math.pow (Lamb_e,2)) / Math.pow((Math.sqrt(1 - Math.pow (Lamb_e,2) * Math.pow(Math.sin (Lamb_Phi2 * Math.PI / 180),2))),3);
    var Lamb_m1 = 1 + Lamb_Ro01 / 2 / Lamb_v01 * Math.pow((Lamb_Phi1 - Lamb_Phi0) * Math.PI / 180,2);
    var Lamb_m2 = 1 + Lamb_Ro02 / 2 / Lamb_v02 * Math.pow((Lamb_Phi2 - Lamb_Phi0) * Math.PI / 180,2);
    var Lamb_m = (Lamb_m1 + Lamb_m2) / 2;
    var Lamb_mL = 2 - Lamb_m;

    <!-- Rayon du parallèle d origine après réduction d echelle en mètres -->
    var Lamb_mLR0 = Lamb_mL * Lamb_R0;

    <!-- Rayon du parallèle passant par le point recherché en mètres -->
    var Lamb_R = Lamb_mLR0 * Math.exp(- Math.sin(Lamb_Phi0 * Math.PI / 180) * (Lamb_LatIso - Lamb_LatIso0));

    <!-- Abscisse X1 dans le repère associé au méridien d origine et au parallèle d origine en mètres -->
    var Lamb_E1 = Lamb_R * Math.sin(Lamb_Gamma * Math.PI / 180);

    <!-- Coordonnées Lambert II du point recherché en mètres -->
    var Lamb_EE = Lamb_E1 + Lamb_Ce * 1000;
    var Lamb_NN = Lamb_mLR0 - Lamb_R + Lamb_E1 * Math.tan(Lamb_Gamma * Math.PI / 360) + Lamb_Cn * 1000;

    <!-- arrondissement des valeurs pour affichage 3 chiffres après la virgule -->
    var Lamb_EE_Arr = Math.round(Lamb_EE * 1000) / 1000
    var Lamb_NN_Arr = Math.round(Lamb_NN * 1000) / 1000

    return new Array(Lamb_EE_Arr,Lamb_NN_Arr);

<!-- Fin de la fonction de conversion des valeurs sexagésimales NTF (géoconcept) en coordonnées Lambert II étendu -->
}


function Hayford_Clarke(p_Long_Deg,p_Long_Min,p_Long_Sec,p_Lat_Deg,p_Lat_Min,p_Lat_Sec,p_Long_sgn,p_Lat_sgn)
<!-- De PRIAM (ED50) - Hayford 1909 (3) -- VERS -- GeoConcept (NTF) Sexa - Clarke 1880 (1) -->
    {
    <!-- Constantes Ellipsoïde Hayford PRIAM ED50 -->
    var Hayford_a = 6378388.00;
    var Hayford_f = 297;
    var Hayford_b = Hayford_a - (Hayford_a / Hayford_f);

    // la valeur e est en fait e au carré

    var Hayford_e = (Math.pow(Hayford_a,2) - Math.pow(Hayford_b,2)) / Math.pow(Hayford_a,2);

    <!-- Constantes Ellipsoïde Clarke GeoConcept NTF -->
    var Clarke_a = 6378249.2;
    var Clarke_b = 6356515;
    var Clarke_f = 1 / ((Clarke_a - Clarke_b) / Clarke_a);

    // la valeur e est en fait e au carré

    var Clarke_e = (Math.pow(Clarke_a,2) - Math.pow(Clarke_b,2)) / Math.pow(Clarke_a,2);

    <!-- Constantes Tx, Ty, Tz en mètres de Transformation de 3 vers 1 -->
    var Tx = 84;
    var Ty = -37;
    var Tz = -437;

    <!-- Coordonnées LONGITUDE Priam Saisies (Si W -> -1 ou Si E -> 1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) -->

    <!-- Mise en Float des variables lues pour éviter les erreurs NaN (Not a Number) -->
    var Pri_Long_Sgn = parseFloat(p_Long_sgn);
    var Pri_Long_Deg = parseFloat(p_Long_Deg);
    var Pri_Long_Min = parseFloat(p_Long_Min);
    var Pri_Long_Sec = parseFloat(p_Long_Sec);

    <!-- Coordonnées LONGITUDE Priam (Lambda) Décimale calculée -->
    var Pri_Long_Dec = Pri_Long_Sgn * ((Pri_Long_Deg) + (Pri_Long_Min / 60) + (Pri_Long_Sec / 3600));

    <!-- Coordonnées LATITUDE Priam Saisies (Si N -> 1 ou Si S -> -1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) -->
    <!-- var Pri_Lat_Signe = Test du menu déroulant N ou S générant 1 ou -1 Normalement Nord sinon Pas de Lambert ! -->

    <!-- Mise en Float les variables lues pour éviter les erreurs NaN (Not a Number) -->
    var Pri_Lat_Sgn = parseFloat(p_Lat_sgn);
    var Pri_Lat_Deg = parseFloat(p_Lat_Deg);
    var Pri_Lat_Min = parseFloat(p_Lat_Min);
    var Pri_Lat_Sec = parseFloat(p_Lat_Sec);

    <!-- Coordonnées LATITUDE Priam (Phi) Décimale calculée -->
    var Pri_Lat_Dec = Pri_Lat_Sgn * ((Pri_Lat_Deg) + (Pri_Lat_Min / 60) + (Pri_Lat_Sec / 3600));

    <!-- Pas de considération de hauteur (en mètres) mis à 0 -- Peut être perfectible en ajoutant les tables de hauteur -->
    var Hauteur = 0;

    <!-- Référence Méridien de Grennwich pas décalage d'un système à l'autre -->

     <!-- Partie - coordonnées géocentriques sur l'ellipsoïde 'H' Origine (Hayford 1909 - ED50 Priam)
    <!-- Variable v (en mètres) calculée par la fct Hayford_a / Racine(1-(Hayford_e*sin(Pri_Lat_Dec*(Pi/180)))^2) -->
    var H_v = Hayford_a / (Math.sqrt(1 - (Hayford_e * Math.pow(Math.sin(Pri_Lat_Dec * (Math.PI / 180)),2))))

    <!-- Variable X calculée en mètres X = (v+h).Cos(Phi).Cos(Lambda) (H_X comme Hayford Z) -->
    var H_X = (H_v + Hauteur) * Math.cos(Pri_Lat_Dec * (Math.PI / 180)) * Math.cos(Pri_Long_Dec * (Math.PI / 180));

    <!-- Variable Y calculée en mètres Y = (v+h).Cos(Phi).Sin(Lambda) (H_Y comme Hayford Z) -->
    var H_Y = (H_v + Hauteur) * Math.cos(Pri_Lat_Dec * (Math.PI / 180)) * Math.sin(Pri_Long_Dec * (Math.PI / 180));

    <!-- Variable Z calculée en mètres Z = (v*(1-e)+h).Sin(Phi) (H_Z comme Hayford Z) -->
    var H_Z = (H_v * (1 - Hayford_e) + Hauteur) * Math.sin(Pri_Lat_Dec * (Math.PI / 180));

     <!-- Partie - coordonnées géocentriques sur l'ellipsoïde 'C' Destination (Clarke 1880 - NTF Lambet GeoConcept) -->
    <!-- Décalage longitude Paris Greenwich (2° 20' 14.025"") - Valeur en Degrés décimaux -->
    var Paris_Green = 2 + (20 / 60) + (14.025 / 3600);
    <!-- Dans ce cas aucune différence - même référence = Greenwich nommé Lambda_0 -->
    var Lambda_0 = 0;

    <!-- Variable C_X calculée en mètres X'= Tx + X * Cos(Lambda_0) + Y * Sin(Lambda_0) (C_X comme Clarke X) -->
    var C_X = Tx + H_X * Math.cos(Lambda_0 * (Math.PI / 180)) + H_Y * Math.sin(Lambda_0 * (Math.PI / 180));

    <!-- Variable C_Y calculée en mètres Y'= Ty - X * Sin(Lambda_0) + Y * Cos(Lambda_0) (C_Y comme Clarke Y) -->
    var C_Y = Ty - H_X * Math.sin(Lambda_0 * (Math.PI / 180)) + H_Y * Math.cos(Lambda_0 * (Math.PI / 180));

    <!-- Variable C_Z calculée en mètres Z'= Z + Tz (C_Z comme Clarke Z) -->
    var C_Z = H_Z + Tz;

    <!-- Variable Re_1 calculée en mètres Re_1 = RACINE (X'^2 + Y'^2) Re_1 Car autre formule de calcul donne meme résultat -->
    var Re_1 = Math.sqrt(Math.pow(C_X,2) + (Math.pow(C_Y,2)));

     <!-- Partie Coordonnées géographiques sur l'ellipsoïde 'C' de destination - Clarke 1880 - Origine Greenwich -->
    <!-- Longitude Lambda en degrés décimaux sur Clarke - Long_C_Dec = Atan(Y'/X')/(Pi/180) -->
    var Long_C_Dec = Math.atan(C_Y / C_X) / (Math.PI / 180);

    <!-- Latitude Phi en degrés décimaux sur Clarke - Lat_C_Dec = difficile à énoncer calcul récurcif -->
    var ecart = 1;
    var Phi = Pri_Lat_Dec / (180 * Math.PI);
    while (ecart > 0.0000000001)
        {
        Phi_1 = Math.atan((C_Z + Clarke_e * Math.sin(Phi) * Clarke_a / Math.sqrt(1 - Clarke_e * Math.pow(Math.sin(Phi),2))) / Re_1);
        ecart = Math.abs(Phi - Phi_1);
        Phi = Phi_1;
        }
    var Lat_C_Dec = Phi * (180 / Math.PI);

    <!-- Variable v en mètre sur Geoïde de destination - C_v = Clarke_a / (racine (1 - Clarke_e * (sin(Phi * 180/PI)^2) -->
    var C_v = Clarke_a / (Math.sqrt(1 - (Clarke_e * Math.pow(Math.sin(Lat_C_Dec * (Math.PI / 180)),2))));

    <!-- Hauteur ellipsoïdale h_C en mètres - Résultat à corriger pour passer à des altitudes NGF au dessus de l'éllipsoïde -->
    <!-- Formule = h_C = Re / Cos(Phi) - v -->
    var h_C = Re_1 / Math.cos(Lat_C_Dec*(Math.PI / 180)) - C_v;

     <!-- Tranformation Degrés décimaux Longitude arrivée en degré minute seconde avec reconnaissance E W -->
    if (Long_C_Dec > 0)
        {
        var E_W_Long_C = 1;
        }
    else
        {
        var E_W_Long_C = -1;
        }
    Long_C_Dec = Math.abs(Long_C_Dec);
    var Deg_Long_C = Math.abs(Math.floor(Long_C_Dec));
    var Min_Long_C = Math.floor((Long_C_Dec - Deg_Long_C) * 60);
    var Sec_Long_C = Math.round(((Long_C_Dec - Deg_Long_C - Min_Long_C / 60) * 3600)*1000)/1000;

     <!-- Tranformation Degrés décimaux Latitude arrivée en degré minute seconde avec reconnaissance N S -->
    if (Lat_C_Dec > 0)
        {
        var N_S_Lat_C = 1;
        }
    else
        {
        var N_S_Lat_C = -1;
        }
    Lat_C_Dec = Math.abs(Lat_C_Dec);
    var Deg_Lat_C = Math.floor(Lat_C_Dec);
    var Min_Lat_C = Math.floor((Lat_C_Dec - Deg_Lat_C) * 60);
    var Sec_Lat_C = Math.round(((Lat_C_Dec - Deg_Lat_C - Min_Lat_C / 60) * 3600)*1000)/1000;


    var la_Result = NTF_Lambert(Deg_Long_C, Min_Long_C, Sec_Long_C, Deg_Lat_C, Min_Lat_C, Sec_Lat_C, E_W_Long_C, N_S_Lat_C);
    return la_Result;


<!-- Fin de la fonction De PRIAM (ED50) - Hayford 1909 (3) -- VERS -- GeoConcept (NTF) Sexa - Clarke 1880 (1) -->
    }

function WGS_ED50(p_Longitude,p_Latitude)
<!-- De GPS (WGS84) - Iagrs80 (2) -- VERS -- ED50 Sexa - Hayford 1909 (3)-->
    {
    <!-- Constantes Ellipsoïde Hayford PRIAM ED50 -->

    var ED50_a = 6378388.00;
    var ED50_f = 297;
    var ED50_b = ED50_a - (ED50_a / ED50_f);

    // la valeur e est en fait e au carré

    var ED50_e = (Math.pow(ED50_a,2) - Math.pow(ED50_b,2)) / Math.pow(ED50_a,2);

    <!-- Constantes Ellipsoïde Iagrs reporté GPS WGS84 -->
    var WGS_a = 6378137;

    // La valeur f d origine Iagrs est 298.2572221010

    var WGS_f = 298.257223563;

    var WGS_b = WGS_a - (WGS_a / WGS_f);

    // la valeur e est en fait e au carré

    var WGS_e = (Math.pow(WGS_a,2) - Math.pow(WGS_b,2)) / Math.pow(WGS_a,2);

    <!-- Constantes Tx, Ty, Tz en mètres de Transformation de 3 vers 2 -->
    var Tx = 84;
    var Ty = 97;
    var Tz = 117;

    <!-- Coordonnées LONGITUDE WGS84 Saisies (Si W -> -1 ou Si E -> 1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) -->


    <!-- Coordonnées LONGITUDE WGS84 (Lambda) Décimale calculée -->
    var WGS_Long_Dec = p_Longitude;

    <!-- Coordonnées LATITUDE WGS84 Saisies (Si N -> 1 ou Si S -> -1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) -->
    <!-- var Pri_Lat_Signe = Test du menu déroulant N ou S générant 1 ou -1 Normalement Nord sinon Pas de Lambert ! -->

    <!-- Mise en Float les variables lues pour éviter les erreurs NaN (Not a Number) -->


    <!-- Coordonnées LATITUDE Priam (Phi) Décimale calculée -->
    var WGS_Lat_Dec = p_Latitude;

    <!-- Pas de considération de hauteur (en mètres) mis à 0 -- Peut être perfectible en ajoutant les tables de hauteur -->
    var Hauteur = 0;

    <!-- Référence Méridien de Grennwich pas décalage d'un système à l'autre (n'affecte que le goide de Clarke) -->

     <!-- Partie - coordonnées géocentriques sur l'ellipsoïde Origine -->
    <!-- Variable v (en mètres) calculée -->
    var WGS_v = WGS_a / (Math.sqrt(1 - (WGS_e * Math.pow(Math.sin(WGS_Lat_Dec * (Math.PI / 180)),2))));

    <!-- Variable X calculée en mètres -->
    var WGS_X = (WGS_v + Hauteur) * Math.cos(WGS_Lat_Dec * (Math.PI / 180)) * Math.cos(WGS_Long_Dec * (Math.PI / 180));

    <!-- Variable Y calculée en mètres Y = (v+h).Cos(Phi).Sin(Lambda) (H_Y comme Hayford Z) -->
    var WGS_Y = (WGS_v + Hauteur) * Math.cos(WGS_Lat_Dec * (Math.PI / 180)) * Math.sin(WGS_Long_Dec * (Math.PI / 180));

    <!-- Variable Z calculée en mètres Z = (v*(1-e)+h).Sin(Phi) (H_Z comme Hayford Z) -->
    var WGS_Z = (WGS_v * (1 - WGS_e) + Hauteur) * Math.sin(WGS_Lat_Dec * (Math.PI / 180));

     <!-- Partie - coordonnées géocentriques sur l'ellipsoïde Destination -->
    <!-- Décalage longitude Paris Greenwich (2° 20' 14.025"") - Valeur en Degrés décimaux -->
    var Paris_Green = 2 + (20 / 60) + (14.025 / 3600);

    <!-- Dans ce cas aucune différence - même référence = Greenwich nommé Lambda_0 -->
    var Lambda_0 = 0;

    <!-- Variable X' calculée en mètres -->
    var ED50_X = Tx + WGS_X * Math.cos(Lambda_0 * (Math.PI / 180)) + WGS_Y * Math.sin(Lambda_0 * (Math.PI / 180));

    <!-- Variable Y' calculée en mètres -->
    var ED50_Y = Ty - WGS_X * Math.sin(Lambda_0 * (Math.PI / 180)) + WGS_Y * Math.cos(Lambda_0 * (Math.PI / 180));

    <!-- Variable Z' calculée en mètres -->
    var ED50_Z = WGS_Z + Tz;

    <!-- Variable Re_1 calculée en mètres Re_1 = RACINE (X'^2 + Y'^2) Re_1 Car autre formule de calcul donne meme résultat -->
    var Re_1 = Math.sqrt(Math.pow(ED50_X,2) + (Math.pow(ED50_Y,2)));

     <!-- Partie Coordonnées géographiques sur l'ellipsoïde de destination Origine Greenwich -->
    <!-- Longitude Lambda en degrés décimaux sur Hayford -->
    var Long_ED50_Dec = Math.atan(ED50_Y / ED50_X) / (Math.PI / 180);

    <!-- Latitude Phi en degrés décimaux sur Iagrs -->
    var ecart = 1;
    var Phi = WGS_Lat_Dec / (180 * Math.PI);
    while (ecart > 0.0000000001)
        {
        Phi_1 = Math.atan((ED50_Z + ED50_e * Math.sin(Phi) * ED50_a / Math.sqrt(1 - ED50_e * Math.pow(Math.sin(Phi),2))) / Re_1);
        ecart = Math.abs(Phi - Phi_1);
        Phi = Phi_1;
        }
    var Lat_ED50_Dec = Phi * (180 / Math.PI);

    <!-- Variable v en mètre sur Geoïde de destination - I_v = Iagrs_a / (racine (1 - Iagrs_e * (sin(Phi * 180/PI)^2) -->
    var ED50_v = ED50_a / (Math.sqrt(1 - (ED50_e * Math.pow(Math.sin(Lat_ED50_Dec * (Math.PI / 180)),2))));

    <!-- Hauteur ellipsoïdale h_I en mètres - Résultat à corriger pour passer à des altitudes NGF au dessus de l'éllipsoïde -->
    <!-- Formule = Re / Cos(Phi) - v -->
    var h_ED50 = Re_1 / Math.cos(Lat_ED50_Dec*(Math.PI / 180)) - ED50_v;

     <!-- Tranformation Degrés décimaux Longitude arrivée en degré minute seconde avec reconnaissance E W -->
    if (Long_ED50_Dec > 0)
        {
        var E_W_Long_ED50 = 1;
        }
    else
        {
        var E_W_Long_ED50 = -1;
        }
    Long_ED50_Dec = Math.abs(Long_ED50_Dec);
    var Deg_Long_ED50 = Math.abs(Math.floor(Long_ED50_Dec));
    var Min_Long_ED50 = Math.floor((Long_ED50_Dec - Deg_Long_ED50) * 60);
    var Sec_Long_ED50 = Math.round(((Long_ED50_Dec - Deg_Long_ED50 - Min_Long_ED50 / 60) * 3600)*1000)/1000;

     <!-- Tranformation Degrés décimaux Latitude arrivée en degré minute seconde avec reconnaissance N S -->
    if (Lat_ED50_Dec > 0)
        {
        var N_S_Lat_ED50 = 1;
        }
    else
        {
        var N_S_Lat_ED50 = -1;
        }
    Lat_ED50_Dec = Math.abs(Lat_ED50_Dec);
    var Deg_Lat_ED50 = Math.floor(Lat_ED50_Dec);
    var Min_Lat_ED50 = Math.floor((Lat_ED50_Dec - Deg_Lat_ED50) * 60);
    var Sec_Lat_ED50 = Math.round(((Lat_ED50_Dec - Deg_Lat_ED50 - Min_Lat_ED50 / 60) * 3600)*1000)/1000;


    var la_Result = Hayford_Clarke(Deg_Long_ED50, Min_Long_ED50, Sec_Long_ED50, Deg_Lat_ED50, Min_Lat_ED50, Sec_Lat_ED50, E_W_Long_ED50, N_S_Lat_ED50);
    return la_Result;

<!-- Fin de la fonction De GPS (WGS84) Sexa - Iagrs80 (2) -- VERS --  PRIAM (ED50) - Hayford 1909 (3) -->
    }
