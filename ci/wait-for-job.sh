#!/usr/bin/env bash
# Wait until a Kubernetes Job reaches Complete or Failed, print every pod log, and exit with the
# Job's verdict. `kubectl wait --for=condition=complete` alone would hang until timeout on failure.
set -euo pipefail
JOB="${1:?usage: wait-for-job.sh <job-name> [timeout-seconds]}"
TIMEOUT="${2:-900}"
deadline=$(( $(date +%s) + TIMEOUT ))
verdict=""
while [ "$(date +%s)" -lt "$deadline" ]; do
  conditions=$(kubectl get job "$JOB" -o jsonpath='{range .status.conditions[?(@.status=="True")]}{.type}{" "}{end}' 2>/dev/null || true)
  case " $conditions " in
    *" Complete "*) verdict=Complete; break ;;
    *" Failed "*)   verdict=Failed; break ;;
  esac
  sleep 10
done
echo "::group::Pod logs for job/$JOB"
kubectl logs -l "job-name=$JOB" --all-containers --prefix --tail=-1 --max-log-requests=10 || true
echo "::endgroup::"
if [ -z "$verdict" ]; then
  echo "::error::job/$JOB did not finish within ${TIMEOUT}s"
  kubectl describe job "$JOB" || true
  kubectl get pods -l "job-name=$JOB" -o wide || true
  exit 2
fi
kubectl get job "$JOB" -o wide
if [ "$verdict" = Failed ]; then
  echo "::warning::job/$JOB finished with failing tests (see reports)"
  kubectl describe job "$JOB" | tail -n 20 || true
  exit 1
fi
echo "job/$JOB completed successfully"
