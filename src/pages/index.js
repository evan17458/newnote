import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import Heading from "@theme/Heading";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <div className={styles.containerFlex}>
        <div className={styles.topcontainer}>
          <img className={styles.heroimg} src="/img/hero.png" />
        </div>

        <div className={styles.downcontainer}>
          <div className={styles.text2}>打造數位體驗，設計明天。</div>

          <div className={styles.text}>
            歡迎來到我的數位畫布，這裡有創新和創造力 收斂。
            憑藉對美學的敏銳洞察力和對程式碼的掌握，我的
            作品集展示了反映我的多樣化項目集合 追求卓越的承諾。
          </div>
        </div>
      </div>
      {/* <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main> */}
    </Layout>
  );
}
