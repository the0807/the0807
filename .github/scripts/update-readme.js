const fetch = require('isomorphic-fetch');
const fs = require('fs');

const gistId = 'ecae8fda1d46809a13767fce0f1d9e6c'; // 본인 Gist의 ID로 대체
const gistApiUrl = `https://api.github.com/gists/${gistId}`;

const gistId2 = 'a9c98c9c3af3c36b92a6f316944367cd'; // 본인 Gist의 ID로 대체
const gistApiUrl2 = `https://api.github.com/gists/${gistId2}`;

async function getGistContent() {
  try {
    const response = await fetch(gistApiUrl);
    const data = await response.json();

    const response2 = await fetch(gistApiUrl2);
    const data2 = await response.json();

    if (response.ok && response2.ok) {
      const files = data.files;
      const contentArray = Object.values(files).map(file => file.content);
      const combinedContent = contentArray.join('\n\n');
      const nameArray = Object.values(files).map(file => file.filename);

      const files2 = data2.files;
      const contentArray2 = Object.values(files2).map(file => file.content);
      const combinedContent2 = contentArray2.join('\n\n');
      const nameArray2 = Object.values(files2).map(file => file.filename);
      
      // Read existing README.md
      let readmeContent = fs.readFileSync('README.md', 'utf-8');
      
      // Replace content between markers with Gist content
      const startMarker = '<!-- GIST_START_MARKER -->'; // 엔터 추가
      const endMarker = '<!-- GIST_END_MARKER -->'; // 엔터 추가
      const startIndex = readmeContent.indexOf(startMarker) + startMarker.length;
      const endIndex = readmeContent.indexOf(endMarker);
      readmeContent = readmeContent.substring(0, startIndex) + '\n' + '<pre align = "center">' + '\n' + nameArray + '\n\n' + combinedContent + '\n' + '</pre>' + '\n' + '\n' + '<pre align = "center">' + '\n' + nameArray2 + '\n\n' + combinedContent2 + '\n' + '</pre>' + '\n' + readmeContent.substring(endIndex);

      console.log(readmeContent);
      
      // Update README.md with modified content
      fs.writeFileSync('README.md', readmeContent);

      console.log('README.md updated successfully.');
    } else {
      console.error(`Failed to fetch Gist. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching Gist:', error.message);
  }
}

getGistContent();
