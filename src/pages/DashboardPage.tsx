import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import EditVariablesPanel from '../components/EditVariablesPanel';
import accordionArrow from '../assets/accordion-arrow.svg';
import uploadIcon from '../assets/upload.svg';
import historyIcon from '../assets/history.svg';
import questionIcon from '../assets/question.svg';
import star from '../assets/star.svg';
import { useNavigate } from 'react-router-dom';
import clouduploadIcon from '../assets/cloudupload.svg';
import bellIcon from '../assets/bell.svg';
import settingIcon from '../assets/setting.svg';
import timelistIcon from '../assets/timelist.svg';
import profileIcon from '../assets/profile.svg';
import homeIcon from '../assets/home.svg';
import DashboardChart from '../components/DashboardChart';

const kpis = [
  { title: 'Infrastructure Units', value: '€421.07', desc: 'This describes variable one and what the shown data means.' },
  { title: 'Charging Growth', value: '33.07', desc: 'This describes variable two and what the shown data means.' },
  { title: 'Localization change', value: '21.9%', desc: 'This describes variable three and what the shown data means.' },
  { title: 'Fleet growth', value: '7.03%', desc: 'This describes variable four and what the shown data means.' },
];

const sidebarIcons = [
  { icon: homeIcon, label: 'Home' },
  { icon: bellIcon, label: 'Notifications' },
  { icon: timelistIcon, label: 'Time List' },
  { icon: clouduploadIcon, label: 'Cloud Upload' },
  { icon: settingIcon, label: 'Settings' },
];

const tabs = [
  'Charging Stations',
  'Fleet Sizing',
  'Parking',
];

const dashboardTabIcons = ["", "", ""];

const COLORS = {
  background: '#181A20',
  card: '#23252B',
  border: '#2D2F36',
  neon: '#D7FF3A',
  text: '#FFFFFF',
  textMuted: '#A0A3AD',
  infoIcon: '#A0A3AD',
};

const MainWrapper = styled.div`
  display: flex;
  height: 100vh;
  background: ${COLORS.background};
  overflow: hidden;
`;

const Sidebar = styled.aside`
  width: 80px;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  border-right: 1px solid ${COLORS.card};
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.header`
  background: #000;
  padding: 16px 32px 16px 32px;
  border-bottom: 1px solid ${COLORS.card};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
`;

const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const TabButton = styled.button<{ active: boolean }>`
  background: ${({ active }) => (active ? COLORS.card : 'transparent')};
  color: ${COLORS.text};
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 0;
  padding: 10px 24px;
  cursor: pointer;
  transition: background 0.18s;
  outline: none;
  &:hover {
    background: ${COLORS.card};
  }
`;

const SearchBar = styled.div`
  background: ${COLORS.card};
  border-radius: 8px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid ${COLORS.border};
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: ${COLORS.text};
  outline: none;
  font-size: 14px;
  width: 120px;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0 32px 0 32px;
  color: ${COLORS.text};
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const TitleLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TitleIcon = styled.span`
  font-size: 28px;
  color: #fff;
`;

const TitleText = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.2;
`;

const TitleRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  background: #181A20;
  border: 1.5px solid #23252B;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.18s, border 0.18s;
  &:hover {
    background: #23252B;
    border-color: #C6FF4F;
    color: #C6FF4F;
  }
`;

const EditVariablesButton = styled.button`
  background: #242424;
  border: 1.5px solid #5A5A5A;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  padding: 0 16px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: background 0.18s, border 0.18s, color 0.18s;
  &:hover {
    background: #242424;
    border-color: #C6FF4F;
    color: #C6FF4F;
  }
`;

const ScenarioSection = styled.section`
  margin-bottom: 28px;
`;

const ScenarioTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #D6FF4F;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.2;
`;

const ScenarioBox = styled.div`
  background: rgba(214,255,76,0.04);
  border: 0.5px solid #C8E972;
  border-radius: 10px;
  color: #D6FF4F;
  font-size: 14px;
  font-weight: 500;
  padding: 14px 18px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.3;
  min-height: 52px;
`;

const ScenarioBoxRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const GraphsAndKPIRow = styled.section`
  display: flex;
  gap: 24px;
  flex: 1;
  align-items: stretch;
  min-height: 340px;
  flex-wrap: wrap;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const GraphSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
  min-width: 0;
`;

const KPISection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1.2;
  min-width: 0;
`;

const KPISectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ChartCard = styled.div`
  background: ${COLORS.card};
  border: 1.5px solid ${COLORS.border};
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 18px 0;
  height: 100%;
  min-height: 340px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 0;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
`;

const KPICard = styled.div`
  background: #23252B;
  border: 1.5px solid #393B40;
  border-radius: 12px;
  box-shadow: 0 2px 0 #181A20;
  padding: 16px 14px 12px 14px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 108px;
  color: #fff;
  position: relative;
  overflow: visible;
  margin: 0;
`;

const KPICardTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
`;

const KPICardTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
`;

const KPICardInfo = styled.div`
  color: #A0A3AD;
  font-size: 16px;
  cursor: pointer;
  position: relative;
`;

const KPICardDesc = styled.div`
  color: #A0A3AD;
  font-size: 13px;
  margin-bottom: 12px;
  line-height: 1.3;
  flex: 1;
`;

const KPICardValue = styled.div`
  font-size: 38px;
  font-weight: 800;
  color: #fff;
  font-family: 'Inter', sans-serif;
  margin-top: auto;
  line-height: 1.1;
  width: 100%;
  text-align: right;
`;

const KPIGridStretched = styled(KPIGrid)`
  height: 100%;
  align-items: stretch;
`;

const KPICardStretched = styled(KPICard)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: visible;
`;

const DashboardCard = styled.div`
  background: #1A1B20;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
  padding: 24px 24px 20px 24px;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 100%;
  @media (max-width: 900px) {
    padding: 12px 8px 10px 8px;
    margin-top: 12px;
    margin-bottom: 12px;
  }
`;

const DashboardCardTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const DashboardCardTitleLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DashboardCardIcon = styled.span`
  font-size: 28px;
  color: #fff;
  display: flex;
  align-items: center;
`;

const DashboardCardTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  color: #fff;
  margin: 0;
  line-height: 1.2;
`;

const TopBodyActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const OutlinedIconButton = styled.button`
  background: #242424;
  border: 1.5px solid #5A5A5A;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  padding: 0 16px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: background 0.18s, border 0.18s, color 0.18s;
  &:hover {
    background: #242424;
    border-color: #C6FF4F;
    color: #C6FF4F;
  }
`;

const GraphsHeader = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
  margin-bottom: 12px;
`;

const KPIHeader = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
`;

const VariablesButton = styled.button`
  background: ${COLORS.card};
  border: 1.5px solid ${COLORS.border};
  border-radius: 8px;
  color: ${COLORS.text};
  font-size: 14px;
  font-weight: 600;
  padding: 0 16px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: background 0.18s, border 0.18s, color 0.18s;
  &:hover {
    background: ${COLORS.background};
    border-color: ${COLORS.neon};
    color: ${COLORS.neon};
  }
`;

const DashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [kpiTooltip, setKpiTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeSidebarItem, setActiveSidebarItem] = useState(0);
  const [editVariablesOpen, setEditVariablesOpen] = useState(false);
  const [scenarioAccordionOpen, setScenarioAccordionOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    navigate('/login');
  };

  return (
    <MainWrapper>
      {/* Sidebar */}
      <Sidebar>
        {/* Hamburger menu (three lines) */}
        <div 
          style={{ 
            width: 40, 
            height: 40, 
            background: 'transparent', 
            borderRadius: 8, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: 32,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {null}
        </div>
        {/* Main icons */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, justifyContent: 'flex-start' }}>
          {sidebarIcons.map((item, idx) => {
            const icon = item.icon;
            const label = item.label;
            const isActive = activeSidebarItem === idx;
            return (
              <div
                key={label}
                style={{
                  width: 'auto',
                  height: 'auto',
                  borderRadius: 8,
                  background: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 0 0 1.5px #525252' : 'none',
                  padding: isActive ? '10px 12px' : '10px 12px',
                }}
                onClick={() => setActiveSidebarItem(idx)}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = '#23252B';
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <img src={icon} alt={label} style={{ width: 22, height: 22, filter: isActive ? 'none' : 'invert(54%) sepia(6%) saturate(355%) hue-rotate(37deg) brightness(92%) contrast(87%)', transition: 'filter 0.2s', }} />
              </div>
            );
          })}
        </div>
        {/* Profile icon at bottom */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div
            ref={profileRef}
            style={{
              width: 'auto',
              height: 'auto',
              borderRadius: 8,
              background: showProfileMenu ? 'rgba(255,255,255,0.10)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: showProfileMenu ? '0 0 0 1.5px #525252' : 'none',
              padding: '10px 12px',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => setShowProfileMenu((v) => !v)}
          >
            <img src={profileIcon} alt="profile" style={{ width: 22, height: 22, filter: showProfileMenu ? 'none' : 'invert(54%) sepia(6%) saturate(355%) hue-rotate(37deg) brightness(92%) contrast(87%)', transition: 'filter 0.2s', }} />
            {showProfileMenu && (
              <div
                ref={menuRef}
                style={{
                  position: 'absolute',
                  bottom: 40,
                  left: 0,
                  transform: 'none',
                  background: '#23252B',
                  color: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  padding: '8px 0',
                  minWidth: 120,
                  zIndex: 1000,
                  maxWidth: 'calc(100vw - 16px)',
                  pointerEvents: 'auto',
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: 15,
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </Sidebar>
      
      {/* Main Content */}
      <Content>
        {/* Header */}
        <Header>
          <Tabs>
            {tabs.map((tab, idx) => (
              <TabButton
                key={tab}
                active={activeTab === idx}
                onClick={() => setActiveTab(idx)}
              >
                {tab}
              </TabButton>
            ))}
          </Tabs>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <SearchBar>
              {null}
              <SearchInput placeholder="Search" />
            </SearchBar>
          </div>
        </Header>
        
        {/* Content Area */}
        <MainContent>
          <DashboardCard>
            <DashboardCardTitleRow>
              <DashboardCardTitleLeft>
                <DashboardCardIcon>
                  {null}
                </DashboardCardIcon>
                <DashboardCardTitle>{tabs[activeTab]}</DashboardCardTitle>
              </DashboardCardTitleLeft>
              <TopBodyActions>
                <OutlinedIconButton title="Refresh">
                  <img src={historyIcon} alt="history" />
                </OutlinedIconButton>
                <EditVariablesButton onClick={() => setEditVariablesOpen(true)}>
                   Edit Variables
                </EditVariablesButton>
                <OutlinedIconButton title="Export">
                  <img src={uploadIcon} alt="upload" style={{ width: 22, height: 22, display: 'block' }} />
                </OutlinedIconButton>
              </TopBodyActions>
            </DashboardCardTitleRow>
            {/* Scenario Results */}
            <section>
              <ScenarioSection>
                <ScenarioTitle style={{ cursor: 'pointer' }} onClick={() => setScenarioAccordionOpen(o => !o)}>
                  <img src={star} alt="star" style={{ height: 18, verticalAlign: 'middle' }} />
                  Best Scenario Results
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    <IconButton style={{ color: '#D6FF4F', border: 'none', background: 'transparent', width: 32, height: 32, transition: 'transform 0.2s' }}>
                      <img 
                        src={accordionArrow} 
                        alt="accordion arrow" 
                        style={{
                          width: 24, 
                          height: 24, 
                          transform: scenarioAccordionOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                          transition: 'transform 0.2s',
                          display: 'block',
                        }}
                      />
                    </IconButton>
                  </div>
                </ScenarioTitle>
                {scenarioAccordionOpen && (
                  <>
                    <ScenarioBox>
                      The best found configuration based on profit is characterized by 11 zones (max) with charging stations and 48 total number of poles.
                      <ScenarioBoxRight>
                        <IconButton style={{ color: '#D6FF4F', borderColor: 'transparent', background: 'transparent', width: 28, height: 28 }}>
                          {null}
                        </IconButton>
                      </ScenarioBoxRight>
                    </ScenarioBox>
                    <ScenarioBox>
                      The best found configuration based on satisfied demand is characterized by 11 zones (max) with charging stations and 48 total number of poles.
                      <ScenarioBoxRight>
                        <IconButton style={{ color: '#D6FF4F', borderColor: 'transparent', background: 'transparent', width: 28, height: 28 }}>
                          {null}
                        </IconButton>
                      </ScenarioBoxRight>
                    </ScenarioBox>
                  </>
                )}
              </ScenarioSection>
            </section>
            
            {/* Graphs and KPIs */}
            <GraphsAndKPIRow>
              <GraphSection>
                <GraphsHeader>Graphs</GraphsHeader>
                <DashboardChart />
              </GraphSection>
              <KPISection>
                <KPISectionHeader>
                  <KPIHeader>Key Performance Indicators</KPIHeader>
                  <VariablesButton>
                    Variables
                  </VariablesButton>
                </KPISectionHeader>
                <KPIGridStretched>
                  {kpis.map((kpi, i) => (
                    <KPICardStretched key={kpi.title}>
                      <KPICardTitleRow>
                        <KPICardTitle>{kpi.title}</KPICardTitle>
                        <div style={{ marginLeft: 'auto', position: 'relative', display: 'inline-block' }}
                          onMouseEnter={e => {
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            setKpiTooltip({ text: kpi.desc, x: rect.left + rect.width / 2, y: rect.top });
                          }}
                          onMouseLeave={() => setKpiTooltip(null)}
                        >
                          <img src={questionIcon} alt='question' style={{ width: 18, height: 18, display: 'block' }} />
                          {kpiTooltip && kpiTooltip.text === kpi.desc && (
                            <div
                              style={{
                                position: 'fixed',
                                left: kpiTooltip.x,
                                top: kpiTooltip.y - 48,
                                background: '#23252B',
                                color: '#fff',
                                padding: '8px 12px',
                                borderRadius: 6,
                                fontSize: 13,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                pointerEvents: 'none',
                                zIndex: 2000,
                                transform: 'translateX(-50%)',
                                whiteSpace: 'nowrap',
                                maxWidth: 220,
                                textAlign: 'center',
                                border: '1px solid #393B40',
                              }}
                            >
                              {kpi.desc}
                            </div>
                          )}
                        </div>
                      </KPICardTitleRow>
                      <KPICardDesc>{kpi.desc}</KPICardDesc>
                      <KPICardValue>{kpi.value}</KPICardValue>
                    </KPICardStretched>
                  ))}
                </KPIGridStretched>
              </KPISection>
            </GraphsAndKPIRow>
          </DashboardCard>
        </MainContent>
      </Content>
      {editVariablesOpen && (
        <EditVariablesPanel onClose={() => setEditVariablesOpen(false)} />
      )}
    </MainWrapper>
  );
};

export default DashboardPage; 