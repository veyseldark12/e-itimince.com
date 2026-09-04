// src/App.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { APP_THEME, FONTS } from './constants/theme';
import { uniDatabase } from './data/uniDatabase';
import { quizQuestions } from './data/quizQuestions';
import { bilkentData } from './data/bilkentData';
import { bogaziciData } from './data/bogaziciData';
import { ituData } from './data/ituData';
import { kocData } from './data/kocData';
import { odtuData } from './data/odtuData';
import { hacettepeData } from './data/hacettepeData';
import { marmaraData } from './data/marmaraData';
import { sabanciData } from './data/sabanciData';
import { ytuData } from './data/ytuData';
import { tobbData } from './data/tobbData'; // ← TOBB VERİLERİNİ İMPORT ET!

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { UniversitiesView } from './views/UniversitiesView';
import { CompareView } from './views/CompareView';
import { FavoritesView } from './views/FavoritesView';
import { SimulationView } from './views/SimulationView';
import { QuizView } from './views/QuizView';
import { PuanHesaplamaView } from './views/PuanHesaplamaView';
import { HollandTestView } from './views/HollandTestView';
import { TeacherPanelView } from './views/TeacherPanelView';
import { StudentProfileView } from './views/StudentProfileView';
import { StudentClassView } from './views/StudentClassView';
import { QSRankingsView } from './views/QSRankingsView';
import { TUMARankingsView } from './views/TUMARankingsView';
import { EmploymentAnalysisView } from './views/EmploymentAnalysisView';
import { supabase } from './lib/supabaseClient';

export default function App() {
  const theme = APP_THEME;

  const [activeTab, setActiveTab] = useState('anasayfa');
  const [selectedUniKey, setSelectedUniKey] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [minRank, setMinRank] = useState(10000);
  const [maxRank, setMaxRank] = useState(50000);
  const [simFilterType, setSimFilterType] = useState('ALL');

  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState({ bogazici: 0, itu: 0, odtu: 0, bilkent: 0, koc: 0 });
  const [result, setResult] = useState(null);
  const [percentageResults, setPercentageResults] = useState([]);

  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userClassId, setUserClassId] = useState(null);

  // ---------- KULLANICI OTURUMU ----------
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('name, role, class_id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile) {
          const role = profile.role || 'student';
          setUserRole(role);
          setUserClassId(profile.class_id || null);
          const userData = {
            ...session.user,
            name: profile.name || session.user.email?.split('@')[0],
            role: role,
            class_id: profile.class_id || null,
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ 
              id: session.user.id, 
              name: session.user.email, 
              role: 'student', 
              email: session.user.email 
            }]);
          
          if (!insertError) {
            setUserRole('student');
            const userData = {
              ...session.user,
              name: session.user.email?.split('@')[0],
              role: 'student',
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
      } else {
        setUser(null);
        setUserRole(null);
        setUserClassId(null);
        localStorage.removeItem('user');
      }
    };
    
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, role, class_id')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profile) {
          const role = profile.role || 'student';
          setUserRole(role);
          setUserClassId(profile.class_id || null);
          const userData = {
            ...session.user,
            name: profile.name || session.user.email?.split('@')[0],
            role: role,
            class_id: profile.class_id || null,
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        setUser(null);
        setUserRole(null);
        setUserClassId(null);
        localStorage.removeItem('user');
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  // ---------- VERİLERİ YÜKLE (maybeSingle düzeltmesi) ----------
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('student_data')
        .select('favorites, compare_list')
        .eq('student_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Veri yükleme hatası:', error);
        return;
      }

      if (data) {
        if (data.favorites) setFavorites(data.favorites);
        if (data.compare_list) setCompareList(data.compare_list);
      }
    };
    loadData();
  }, [user]);

  // ---------- FAVORİ VE KIYAS ----------
  const toggleFavorite = async (deptId) => {
    const newFavorites = favorites.includes(deptId)
      ? favorites.filter(id => id !== deptId)
      : [...favorites, deptId];
    setFavorites(newFavorites);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('student_data')
        .upsert({
          student_id: user.id,
          favorites: newFavorites,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'student_id' });
    }
  };

  const toggleCompare = async (dept) => {
    const exists = compareList.some((d) => d.id === dept.id);
    let newCompareList;
    if (exists) {
      newCompareList = compareList.filter((d) => d.id !== dept.id);
    } else {
      if (compareList.length >= 3) {
        alert('En fazla 3 bölümü yan yana kıyaslayabilirsiniz!');
        return;
      }
      newCompareList = [...compareList, dept];
    }
    setCompareList(newCompareList);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const compareIds = newCompareList.map(d => d.id);
      await supabase
        .from('student_data')
        .upsert({
          student_id: user.id,
          compare_list: compareIds,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'student_id' });
    }
  };

  // ---------- UYUM TESTİ ----------
  const handleAnswer = async (optionScores) => {
    const updatedScores = { ...scores };
    for (let key in optionScores) {
      updatedScores[key] = (updatedScores[key] || 0) + optionScores[key];
    }
    setScores(updatedScores);

    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      let totalScore = 0;
      for (let key in updatedScores) totalScore += updatedScores[key];
      const sortedPercentages = Object.keys(updatedScores).map((key) => ({
        key,
        name: uniDatabase[key].name,
        percent: totalScore > 0 ? Math.round((updatedScores[key] / totalScore) * 100) : 0,
      })).sort((a, b) => b.percent - a.percent);

      setPercentageResults(sortedPercentages);
      const resultUni = uniDatabase[sortedPercentages[0].key];
      setResult(resultUni);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('student_data')
          .upsert({
            student_id: user.id,
            uyum_result: {
              result: resultUni,
              sortedPercentages: sortedPercentages,
              scores: updatedScores,
              date: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          }, { onConflict: 'student_id' });
      }
    }
  };

  const resetTest = () => {
    setCurrentIdx(0);
    setScores({ bogazici: 0, itu: 0, odtu: 0, bilkent: 0, koc: 0 });
    setResult(null);
    setPercentageResults([]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    setUserClassId(null);
    localStorage.removeItem('user');
    setActiveTab('anasayfa');
  };

  // ---------- VERİ BİRLEŞTİRME ----------
  const normalizeData = (data, uniKey, uniName) => {
    if (!Array.isArray(data)) return [];
    return data.map((item, index) => {
      const id = item.id || `${uniKey}-${index}`;
      const name = item.name || '';
      const type = item.type || item.scoreType || 'SAY';
      const quota = item.quota || '-';
      const rank2025 = item.rank2025 ?? item.rank ?? '-';
      const score2025 = item.score2025 ?? item.baseScore ?? '-';
      const faculty = item.faculty || 'Fakülte Belirtilmemiş';
      let lang = 'Belirtilmemiş';
      if (name.toLowerCase().includes('ingilizce') || name.toLowerCase().includes('english')) {
        lang = '%100 İngilizce';
      } else if (name.toLowerCase().includes('fransızca')) {
        lang = 'Fransızca / İngilizce';
      } else if (name.toLowerCase().includes('türkçe')) {
        lang = '%100 Türkçe';
      }
      const description = `${faculty} - ${lang}`;
      return { id, name, type, quota, rank2025, score2025, faculty, lang, description, uniKey, uniName };
    });
  };

  const allDepartments = useMemo(() => {
    const uniMap = {
      itu: { data: ituData, name: uniDatabase.itu.name },
      odtu: { data: odtuData, name: uniDatabase.odtu.name },
      koc: { data: kocData, name: uniDatabase.koc.name },
      bogazici: { data: bogaziciData, name: uniDatabase.bogazici.name },
      bilkent: { data: bilkentData, name: uniDatabase.bilkent.name },
      hacettepe: { data: hacettepeData, name: uniDatabase.hacettepe.name },
      marmara: { data: marmaraData, name: uniDatabase.marmara.name },
      sabanci: { data: sabanciData, name: uniDatabase.sabanci.name },
      ytu: { data: ytuData, name: uniDatabase.ytu.name },
      tobb: { data: tobbData, name: uniDatabase.tobb.name }, // ← TOBB'U EKLE!
    };
    let combined = [];
    for (const [key, { data, name }] of Object.entries(uniMap)) {
      const normalized = normalizeData(data, key, name);
      combined = combined.concat(normalized);
    }
    return combined;
  }, []);

  const handleUniSelect = (key) => {
    setSelectedUniKey(key);
    setActiveTab('universiteler');
  };

  return (
    <div
      style={{
        fontFamily: FONTS.body,
        background: theme.bgGradient,
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        color: theme.textPrimary,
      }}
    >
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleUniSelect={handleUniSelect}
        compareCount={compareList.length}
        favoritesCount={favorites.length}
        user={user}
        userRole={userRole}
        userClassId={userClassId}
        onLogout={handleLogout}
      />

      <div
        style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '40px 24px 60px',
          flex: 1,
          boxSizing: 'border-box',
        }}
      >
        {activeTab === 'student-profile' && <StudentProfileView />}
        {activeTab === 'my-class' && <StudentClassView userClassId={userClassId} />}
        {activeTab === 'anasayfa' && (
          <HomeView
            setActiveTab={setActiveTab}
            resetTest={resetTest}
            handleUniSelect={handleUniSelect}
            allDepartments={allDepartments}
          />
        )}

        {activeTab === 'universiteler' && (
          <UniversitiesView
            selectedUniKey={selectedUniKey}
            setSelectedUniKey={setSelectedUniKey}
            allDepartments={allDepartments}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            toggleCompare={toggleCompare}
            compareList={compareList}
          />
        )}

        {activeTab === 'karsilastir' && (
          <CompareView compareList={compareList} setCompareList={setCompareList} toggleCompare={toggleCompare} />
        )}

        {activeTab === 'tercihlerim' && (
          <FavoritesView
            favorites={favorites}
            allDepartments={allDepartments}
            toggleFavorite={toggleFavorite}
          />
        )}
        {activeTab === 'qs-rankings' && <QSRankingsView />}
{activeTab === 'tuma-rankings' && <TUMARankingsView />}
{activeTab === 'employment' && <EmploymentAnalysisView allDepartments={allDepartments} />}

        {activeTab === 'simulasyon' && (
          <SimulationView
            minRank={minRank}
            setMinRank={setMinRank}
            maxRank={maxRank}
            setMaxRank={setMaxRank}
            simFilterType={simFilterType}
            setSimFilterType={setSimFilterType}
            allDepartments={allDepartments}
            compareList={compareList}
            toggleCompare={toggleCompare}
          />
        )}

        {activeTab === 'test' && (
          <QuizView
            currentIdx={currentIdx}
            result={result}
            percentageResults={percentageResults}
            handleAnswer={handleAnswer}
            resetTest={resetTest}
            handleUniSelect={handleUniSelect}
            quizQuestions={quizQuestions}
          />
        )}

        {activeTab === 'puan-hesapla' && <PuanHesaplamaView />}
        {activeTab === 'holland-test' && <HollandTestView />}
        {activeTab === 'teacher-panel' && <TeacherPanelView />}
      </div>

      <Footer />
    </div>
  );
}