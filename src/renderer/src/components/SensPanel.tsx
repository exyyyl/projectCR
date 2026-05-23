import React from 'react'
import { SetupScreen } from './sens/SetupScreen'
import { TestingScreen } from './sens/TestingScreen'
import { ResultScreen } from './sens/ResultScreen'
import { SavedProfilesList } from './sens/SavedProfilesList'
import { usePsaTest } from '../hooks/usePsaTest'
import { PsaGuideModal } from './PsaGuideModal'

export function SensPanel() {
  const {
    screen,
    game,
    setGame,
    dpi,
    setDpi,
    startSens,
    setStartSens,
    isGameDropdownOpen,
    setIsGameDropdownOpen,
    isInfoModalOpen,
    setIsInfoModalOpen,
    step,
    baseSens,
    copiedId,
    profileName,
    setProfileName,
    savedProfiles,
    currentLowSens,
    currentHighSens,
    tableRows,
    baseCm360,
    baseEdpi,
    recommendedConversions,
    handleStartTest,
    handleSelectChoice,
    handleStepBack,
    handleReset,
    handleSaveProfile,
    handleDeleteProfile,
    handleCopyText
  } = usePsaTest()

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar px-4 sm:px-6 pt-5 pb-8 bg-amoled-bg text-amoled-text">
      
      {screen === 'setup' && (
        <SetupScreen
          game={game}
          setGame={setGame}
          dpi={dpi}
          setDpi={setDpi}
          startSens={startSens}
          setStartSens={setStartSens}
          isGameDropdownOpen={isGameDropdownOpen}
          setIsGameDropdownOpen={setIsGameDropdownOpen}
          setIsInfoModalOpen={setIsInfoModalOpen}
          handleStartTest={handleStartTest}
        />
      )}

      {screen === 'testing' && (
        <TestingScreen
          step={step}
          game={game}
          dpi={dpi}
          baseSens={baseSens}
          currentLowSens={currentLowSens}
          currentHighSens={currentHighSens}
          copiedId={copiedId}
          tableRows={tableRows}
          handleStepBack={handleStepBack}
          handleReset={handleReset}
          handleSelectChoice={handleSelectChoice}
          handleCopyText={handleCopyText}
        />
      )}

      {screen === 'result' && (
        <ResultScreen
          game={game}
          dpi={dpi}
          baseSens={baseSens}
          baseEdpi={baseEdpi}
          baseCm360={baseCm360}
          copiedId={copiedId}
          profileName={profileName}
          setProfileName={setProfileName}
          tableRows={tableRows}
          recommendedConversions={recommendedConversions}
          handleCopyText={handleCopyText}
          handleSaveProfile={handleSaveProfile}
          handleReset={handleReset}
        />
      )}

      <SavedProfilesList
        savedProfiles={savedProfiles}
        copiedId={copiedId}
        handleCopyText={handleCopyText}
        handleDeleteProfile={handleDeleteProfile}
      />

      <PsaGuideModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  )
}
