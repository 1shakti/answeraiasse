import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiSearch } from 'react-icons/fi';
import accordionArrow from '../assets/accordion-arrow.svg';
import star from '../assets/star.svg';
import reloadIcon from '../assets/reload.svg';

// Figma color/typography constants
const COLORS = {
  overlay: 'rgba(24,26,32,0.72)',
  modalBg: 'rgba(24,26,32,0.98)',
  border: 'rgba(57,59,64,0.8)',
  cardBg: 'rgba(35,37,43,0.92)',
  cardBorder: 'rgba(57,59,64,0.8)',
  chipActiveBg: 'rgba(198,255,79,0.12)',
  chipActiveBorder: '#C6FF4F',
  chipActiveText: '#C6FF4F',
  chipInactiveBg: 'rgba(89,89,89,0.16)',
  chipInactiveBorder: 'rgba(238,238,238,0.8)',
  chipInactiveText: 'rgba(230,230,230,0.8)',
  chipIconInactive: '#A0A3AD',
  chipIconActive: '#C6FF4F',
  detailsTitle: '#fff',
  detailsDesc: '#A0A3AD',
  accordionBorder: 'rgba(198,255,79,0.8)',
  accordionBg: 'rgba(35,37,43,0.92)',
  accordionText: '#C6FF4F',
  accordionContentBg: '#181A20',
  accordionContentText: '#C6FF4F',
};

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${COLORS.overlay};
  backdrop-filter: blur(4px);
  z-index: 1000;
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  height: 100vh;
  width: 95vw;
  max-width: 691px;
  background: #0E0D0D;
  border-left: 1.5px solid ${COLORS.border};
  border-radius: 18px 0 0 18px;
  box-shadow: -8px 0 32px rgba(0,0,0,0.32);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2.2rem 2.2vw;
  background: #0E0D0D;
  z-index: 2;
  flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const CloseIcon = styled(FiX)`
  color: #A0A3AD;
  font-size: 28px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.18s;
  background: #0E0D0D;
  border-radius: 50%;
  &:hover { opacity: 1; }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 0 0 32px 0;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 28px;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;
const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #A0A3AD;
  font-size: 18px;
`;
const SearchInput = styled.input`
  width: 100%;
  background: #23252B;
  border: 1.5px solid ${COLORS.cardBorder};
  border-radius: 14px;
  color: ${COLORS.chipInactiveText};
  font-size: 16px;
  padding: 16px 20px 16px 44px;
  outline: none;
  height: 48px;
  &::placeholder { color: rgba(230,230,230,0.5); }
`;

const Button = styled.button<{ primary?: boolean }>`
  background: ${({ primary }) =>
    primary
      ? COLORS.chipActiveBg
      : '#23252B'};
  color: ${({ primary }) => (primary ? COLORS.chipActiveText : COLORS.chipInactiveText)};
  font-size: 15px;
  font-weight: 700;
  border-radius: 8px;
  border: ${({ primary }) => (primary ? `1.5px solid ${COLORS.chipActiveBorder}` : `1.5px solid ${COLORS.cardBorder}`)};
  padding: 12px 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-left: ${({ primary }) => (primary ? '8px' : '0')};
`;

const AutofillButton = styled(Button)`
  background: #242424 !important;
  border: 1.5px solid #B9B9B9 !important;
  color: #FFFFFF !important;
`;

const VariableCategoryCard = styled.div<{ detailsOpen?: boolean }>`
  background: #161618;
  border: 1.5px solid ${COLORS.cardBorder};
  border-radius: 16px;
  padding: 2.2rem;
  margin-bottom: ${({ detailsOpen }) => (detailsOpen ? '0' : '2rem')};
  width: 100%;
  box-sizing: border-box;
  transition: border-radius 0.18s, margin-bottom 0.18s;
  ${({ detailsOpen }) =>
    detailsOpen && `
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    `}
  &:last-child { margin-bottom: 0; }
`;
const CategoryLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #F4F4F4;
  letter-spacing: 0.01em;
  line-height: 24px;
  margin-bottom: 16px;
  text-align: left;
`;
const VariableChipsRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 2vw;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;
const VariableChipWrapper = styled.div`
  position: relative;
  display: flex;
  flex: 0 0 auto;
  min-width: 160px;
`;
const VariableChip = styled.span<{ active: boolean; selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  gap: 6px;
  padding: 12px 16px;
  border-radius: 24px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0.01em;
  border: 1px solid ${({ active, selected }) => (active || selected ? COLORS.chipActiveBorder : COLORS.chipInactiveBorder)};
  color: ${({ active, selected }) => (active || selected ? COLORS.chipActiveText : COLORS.chipInactiveText)};
  background: ${({ active, selected }) => (active || selected ? COLORS.chipActiveBg : COLORS.chipInactiveBg)};
  box-shadow: ${({ active, selected }) => (active || selected ? '0 2px 16px 0 rgba(198,255,79,0.15)' : 'none')};
  user-select: none;
  box-sizing: border-box;
  text-align: left;
  white-space: nowrap;
  transition: border 0.18s, color 0.18s, background 0.18s, box-shadow 0.18s;
  cursor: pointer;
  width: 100%;

  &:hover {
    border: 1px solid ${COLORS.chipActiveBorder};
    color: ${COLORS.chipActiveText};
    background: ${COLORS.chipActiveBg};
    box-shadow: 0 2px 16px 0 rgba(198,255,79,0.25);
  }

  & > span {
    flex: 1;
    white-space: nowrap;
    overflow: visible;
    text-overflow: unset;
  }

  & > svg {
    flex-shrink: 0;
  }
`;

const AttachedDetailsCard = styled.div`
  background: ${COLORS.cardBg};
  border: 1.5px solid ${COLORS.cardBorder};
  border-top: none;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.32);
  min-width: 100%;
  padding: 41px 32px 41px 37px;
  color: ${COLORS.detailsTitle};
  position: static;
`;

const DetailsTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${COLORS.detailsTitle};
`;
const DetailsDesc = styled.div`
  font-size: 15px;
  color: ${COLORS.detailsDesc};
  margin-top: 12px;
`;

const AccordionButton = styled.button<{ open: boolean }>`
  width: 100%;
  background: ${COLORS.accordionBg};
  color: ${COLORS.accordionText};
  border: 1.5px solid #525252;
  font-size: 16px;
  font-weight: 700;
  border-radius: 10px;
  padding: 18px 24px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;
const AccordionContent = styled.div`
  background: #23252B;
  color: ${COLORS.accordionContentText};
  border-radius: 10px;
  padding: 18px 24px;
  border: 1.5px solid #393B40;
  font-size: 15px;
  margin-bottom: 12px;
`;
const ChevronIcon = styled.span<{ open: boolean }>`
  display: inline-block;
  transition: transform 0.2s;
  transform: rotate(${({ open }) => (open ? 0 : 180)}deg);
  margin-left: 8px;
  img { display: block; width: 24px; height: 24px; }
`;

// SVG icons
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 9.5L8 12.5L13 7.5" stroke="#C6FF4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 4V14M4 9H14" stroke="#A0A3AD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Placeholder data
const categories = [
  {
    name: 'Variable category 1',
    variables: [
      { name: 'Carbon 1', active: false, info: 'Info about Carbon 1', desc: 'Details for Carbon 1.' },
      { name: 'Co2 Distribution', active: true, info: 'Info about Co2 Distribution', desc: 'Details for Co2 Distribution. But what truly sets Switch apart is its versatility. It can be used as a scooter, a bike, or even a skateboard, making it suitable for people of all ages. Whether you\'re a student, a professional, or a senior citizen, Switch adapts to your needs and lifestyle.' },
      { name: 'Fleet sizing', active: true, info: 'Info about Fleet sizing', desc: 'Details for Fleet sizing.' },
    ],
  },
  {
    name: 'Variable Category 2',
    variables: [
      { name: 'Parking Rate', active: false, info: 'Info about Parking Rate', desc: 'Details for Parking Rate.' },
      { name: 'Border Rate', active: true, info: 'Info about Border Rate', desc: 'Details for Border Rate.' },
      { name: 'Request rate', active: true, info: 'Info about Request rate', desc: 'Details for Request rate.' },
    ],
  },
  {
    name: 'Variable Category 3',
    variables: [
      { name: 'Variable 1', active: false, info: 'Info about Variable 1', desc: 'Details for Variable 1.' },
      { name: 'Variable 1', active: true, info: 'Info about Variable 1', desc: 'Details for Variable 1.' },
      { name: 'Variable 1', active: true, info: 'Info about Variable 1', desc: 'Details for Variable 1.' },
    ],
  },
];

export default function EditVariablesPanel({ onClose = () => {} }) {
  const [primaryOpen, setPrimaryOpen] = useState(true);
  const [secondaryOpen, setSecondaryOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [hoveredChip, setHoveredChip] = useState<{catIdx: number, varIdx: number} | null>(null);
  const [search, setSearch] = useState("");
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // On mount, initialize selected with all chips that are active in data
  useEffect(() => {
    const initialSelected: string[] = [];
    categories.forEach((cat, catIdx) => {
      cat.variables.forEach((v, varIdx) => {
        if (v.active) {
          initialSelected.push(`${catIdx}:${varIdx}`);
        }
      });
    });
    setSelected(initialSelected);
  }, []);

  const handleSelect = (catIdx: number, varIdx: number) => {
    const key = `${catIdx}:${varIdx}`;
    setSelected(prev =>
      prev.includes(key)
        ? prev.filter(n => n !== key)
        : [...prev, key]
    );
  };

  const handleChipMouseEnter = (catIdx: number, varIdx: number, hasDetails: boolean) => {
    if (!hasDetails) return;
    hoverTimeout.current = setTimeout(() => {
      setHoveredChip({catIdx, varIdx});
    }, 500);
  };
  const handleChipMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredChip(null);
  };

  // Find details for hovered chip
  let detailsContent: null | { name: string, desc: string } = null;
  if (hoveredChip) {
    const v = categories[hoveredChip.catIdx]?.variables[hoveredChip.varIdx];
    if (v && v.desc) {
      detailsContent = { name: v.name, desc: v.desc };
    }
  }

  // Filter categories by search
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.variables.some(v => v.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <ModalOverlay />
      <ModalWrapper data-modal-wrapper>
        <ModalHeader>
          <ModalTitle>Edit Variables</ModalTitle>
          <CloseIcon onClick={onClose} />
        </ModalHeader>
        <ModalContent>
          <div style={{ padding: '20px 32px 0 32px' }}>
            <SearchRow>
              <SearchInputWrapper>
                <SearchIcon />
                <SearchInput
                  placeholder="Search categories..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </SearchInputWrapper>
              <AutofillButton>
                <img src={star} alt='star' />
                Autofill
              </AutofillButton>
              <Button primary>
                <img src={reloadIcon} alt="reload" style={{ width: 18, height: 18 }} />
                Rerun
              </Button>
            </SearchRow>
          </div>
          <div style={{ padding: '0 32px', position: 'relative', marginBottom: '32px' }}>
            <VariableCategoryCard detailsOpen={!!detailsContent}>
              {filteredCategories.length === 0 ? (
                <div style={{ color: '#A0A3AD', textAlign: 'center', padding: '32px 0' }}>No categories found.</div>
              ) : (
                filteredCategories.map((cat, i) => {
                  // Find the original index in categories for unique keying
                  const catIdx = categories.findIndex(c => c.name === cat.name);
                  return (
                    <div key={cat.name} style={{ marginBottom: i < filteredCategories.length - 1 ? 32 : 0 }}>
                      <CategoryLabel>{cat.name}</CategoryLabel>
                      <VariableChipsRow>
                        {cat.variables.map((v, j) => {
                          const key = `${catIdx}:${j}`;
                          const isSelected = selected.includes(key);
                          const isActive = isSelected; // Active always matches selected
                          const hasDetails = !!v.desc;
                          return (
                            <VariableChipWrapper key={j}>
                              <VariableChip
                                active={isActive}
                                selected={isSelected}
                                onClick={() => handleSelect(catIdx, j)}
                                onMouseEnter={() => handleChipMouseEnter(catIdx, j, hasDetails)}
                                onMouseLeave={handleChipMouseLeave}
                              >
                                <span style={{ flex: 1 }}>{v.name}</span>
                                <span style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
                                  <img src={star} alt="star" style={{ height: 18, verticalAlign: 'middle' }} />
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
                                  {isActive ? <CheckIcon /> : <PlusIcon />}
                                </span>
                              </VariableChip>
                            </VariableChipWrapper>
                          );
                        })}
                      </VariableChipsRow>
                    </div>
                  );
                })
              )}
            </VariableCategoryCard>
            {detailsContent && (
              <AttachedDetailsCard
                onMouseEnter={() => setHoveredChip(hoveredChip)}
                onMouseLeave={handleChipMouseLeave}
              >
                <DetailsTitle>
                  {detailsContent.name} <span style={{ color: '#A0A3AD', fontSize: 18, marginLeft: 8 }}>ⓘ</span>
                </DetailsTitle>
                <DetailsDesc>
                  {detailsContent.desc}
                </DetailsDesc>
              </AttachedDetailsCard>
            )}
          </div>
          <div style={{ margin: '0 36px' }}>
            <AccordionButton open={primaryOpen} onClick={() => setPrimaryOpen(o => !o)}>
              Primary Variables
              <ChevronIcon open={primaryOpen}>
                <img src={accordionArrow} alt="accordion arrow" />
              </ChevronIcon>
            </AccordionButton>
            {primaryOpen && (
              <AccordionContent>
                Primary variables content...
              </AccordionContent>
            )}
            <AccordionButton open={secondaryOpen} onClick={() => setSecondaryOpen(o => !o)}>
              Secondary Variables
              <ChevronIcon open={secondaryOpen}>
                <img src={accordionArrow} alt="accordion arrow" />
              </ChevronIcon>
            </AccordionButton>
            {secondaryOpen && (
              <AccordionContent>
                Secondary variables content...
              </AccordionContent>
            )}
          </div>
        </ModalContent>
      </ModalWrapper>
    </>
  );
} 