import {mainTitleContainer} from './HomeTitle.css';

import logo from './logo_for_github_white.svg';

export function HomeTitle() {
  return (
    <div class={mainTitleContainer}>
      <h1 aria-label="PipelineUI - Visual workflow for GitHub">
        <img src={logo} width={246} height={75.05} />
      </h1>
    </div>
  );
}
