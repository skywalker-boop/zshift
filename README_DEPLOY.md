ZShift — Ready-to-deploy package
==================================

This package bundles your original project (found in `project_src/`) plus deploy scaffolding for a fast live demo:
  - `hardhat/` : Hardhat config + deploy script
  - `relayer/` : relayer code (includes original relayer if present) + Dockerfile + .env.example
  - `frontend/`: Vite React demo frontend (minimal) with App.jsx ready for Vercel
  - `project_src/`: original uploaded project contents (contracts/, relayer/, frontend/, README.md)

How to use (quick):
1. Inspect the files in project_src/ to verify contract code and relayer logic.
2. Fill environment variables in hardhat/.env and relayer/.env.example (create .env from the example).
3. Deploy contracts:
     cd hardhat
     npm ci
     # set DEPLOYER_PRIVATE_KEY and RPC env vars
     npx hardhat compile
     npx hardhat run scripts_deploy_zshift.js --network baseSepolia
     npx hardhat run scripts_deploy_zshift.js --network arbitrumSepolia

4. Build & run relayer (locally with Docker or on Render/Railway):
     cd relayer
     # create .env from .env.example and fill values
     docker build -t zshift-relayer .
     docker run --env-file .env -d zshift-relayer

5. Frontend (Vercel recommended):
     cd frontend
     npm ci
     # set VITE_RELAYER_ENDPOINT in .env
     npm run build
     # deploy to Vercel or serve with `npm run preview` for local testing

Notes & safety:
  - Do not commit private keys. Use secrets in hosting providers.
  - Verify the LayerZero endpoint addresses and call setTrustedRemote as required.
  - The relayer folder may contain a stub if the original relayer was not present — replace it with your working relayer/index.js if needed.

Generated at: /mnt/data/zshift_deploy_package
