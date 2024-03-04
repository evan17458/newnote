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
          <img src="/img/hero.png" />
        </div>

        <div className={styles.downcontainer}>
          <h1 className={styles.text}>打造數位體驗，設計明天。</h1>

          <p className={styles.test2}>
            歡迎來到我的數位畫布，這裡有創新和創造力 收斂。
            憑藉對美學的敏銳洞察力和對程式碼的掌握，我的
            作品集展示了反映我的多樣化項目集合 追求卓越的承諾。
          </p>
          {/* BUTTONS */}
          {/* <div className="w-full flex gap-4">
            <button className="p-4 rounded-lg ring-1 ring-black bg-black text-white">
              查看我的工作
            </button>
            <button className="p-4 rounded-lg ring-1 ring-black">聯絡我</button>
          </div> */}
        </div>
      </div>
      {/* <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main> */}
    </Layout>
  );
}
