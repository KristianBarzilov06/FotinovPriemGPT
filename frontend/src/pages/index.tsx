import ChatGPT from "@/components/ChatGPT";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";

import HeaderBar from "@/components/HeaderBar";

import styles from "./index.module.less";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<Layout hasSider className={styles.layout}>
			<Layout>
				<HeaderBar />
				<Button>CLick me</Button>
				<Content className={styles.main}>
					<ChatGPT fetchPath="http://localhost:8000/ask" />
				</Content>
			</Layout>
		</Layout>
	);
}
