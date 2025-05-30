import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--surface-color);
  padding: var(--spacing-lg) var(--spacing-xl);
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const Copyright = styled.p`
  color: var(--text-secondary-color);
  font-size: 0.9rem;
  margin-bottom: 0;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          ハニカム/サマすくのデータの著作権は
          <a href="https://www.illgames.jp/" target="_blank" rel="noopener noreferrer">
            ILLGAMES
          </a>
          に帰属します。
        </Copyright>
        <Copyright>
          各データの使用は
          <a href="https://www.illgames.jp/copyright.php" target="_blank" rel="noopener noreferrer">
            ILLGAMESの利用規約
          </a>
          以外の制限はありません。ご自由に使用/改変/再配布してください！
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
}